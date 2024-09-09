import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";
import { NextResponse } from "next/server";
import {
  CachedData,
  ExtendedGitHubUserInfo,
  GitHubUserInfo,
} from "@/models/GithubUser";

const GITHUB_API_BASE = "https://api.github.com";
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getCacheFilePath(username: string): string {
  return path.join(CACHE_DIR, `${username}.json`);
}

function readCache(username: string): CachedData | null {
  const cacheFile = getCacheFilePath(username);
  if (fs.existsSync(cacheFile)) {
    const data = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
    return data as CachedData;
  }
  return null;
}

function writeCache(username: string, data: ExtendedGitHubUserInfo): void {
  const cacheFile = getCacheFilePath(username);
  const cacheData: CachedData = {
    data,
    timestamp: Date.now(),
  };
  fs.writeFileSync(cacheFile, JSON.stringify(cacheData));
}

async function getGitHubUserInfo(username: string): Promise<GitHubUserInfo> {
  const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`);
  return response.data;
}

async function getPullRequestCount(username: string): Promise<number> {
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:pr`
  );
  return response.data.total_count;
}

async function getTotalCommits(username: string): Promise<number> {
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/commits?q=author:${username}`
  );
  return response.data.total_count;
}

async function getCommitsByYear(
  username: string,
  year: number
): Promise<number> {
  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = `${year + 1}-01-01T00:00:00Z`;
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/commits?q=author:${username}+author-date:${startDate}..${endDate}`
  );
  return response.data.total_count;
}

async function getUserIssuesCount(username: string): Promise<number> {
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:issue`
  );
  return response.data.total_count;
}

async function getExtendedGitHubUserInfo(
  username: string
): Promise<ExtendedGitHubUserInfo> {
  const cachedData = readCache(username);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log("Using cached data for", username);
    return cachedData.data;
  }

  try {
    const [userInfo, prCount, totalCommits, lastYearCommits, userIssuesCount] =
      await Promise.all([
        getGitHubUserInfo(username),
        getPullRequestCount(username),
        getTotalCommits(username),
        getCommitsByYear(username, new Date().getFullYear() - 1),
        getUserIssuesCount(username),
      ]);

    const extendedInfo: ExtendedGitHubUserInfo = {
      ...userInfo,
      pullRequestCount: prCount,
      totalCommits: totalCommits,
      commitsLastYear: lastYearCommits,
      userIssuesCount: userIssuesCount,
    };

    writeCache(username, extendedInfo);
    return extendedInfo;
  } catch (error) {
    console.error("Error fetching extended GitHub user info:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const userInfo = await getExtendedGitHubUserInfo(username);
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("Error fetching GitHub user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}
