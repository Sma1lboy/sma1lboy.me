import fs from 'fs'
import path from 'path'

import axios from 'axios'
import { NextResponse } from 'next/server'

import {
  CachedData,
  ExtendedGitHubUserInfo,
  GitHubUserInfo,
} from '@/models/GithubUser'

const GITHUB_API_BASE = 'https://api.github.com'
// Use /tmp directory for Vercel serverless functions
const CACHE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'github-user-cache')
  : path.join(process.cwd(), '.next/cache/github-user')
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

function getCacheFilePath(username: string): string {
  return path.join(CACHE_DIR, `${username}.json`)
}

function readCache(username: string): CachedData | null {
  try {
    const cacheFile = getCacheFilePath(username)

    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
      return data as CachedData
    }
  } catch (error) {
    console.error('Error reading user cache:', error)
    // Continue execution without cache
  }

  return null
}

function writeCache(username: string, data: ExtendedGitHubUserInfo): void {
  try {
    const cacheFile = getCacheFilePath(username)

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true })
    }

    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
    }

    fs.writeFileSync(cacheFile, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error writing user cache:', error)
    // Continue execution without caching
  }
}

async function getGitHubUserInfo(username: string): Promise<GitHubUserInfo> {
  const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`)

  return response.data
}

async function getPullRequestCount(username: string): Promise<number> {
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:pr`
  )

  return response.data.total_count
}

async function getTotalCommits(username: string): Promise<number> {
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/commits?q=author:${username}`
  )

  return response.data.total_count
}

async function getCommitsByYear(
  username: string,
  year: number
): Promise<number> {
  const startDate = `${year}-01-01T00:00:00Z`
  const endDate = `${year + 1}-01-01T00:00:00Z`
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/commits?q=author:${username}+author-date:${startDate}..${endDate}`
  )

  return response.data.total_count
}

async function getUserIssuesCount(username: string): Promise<number> {
  const response = await axios.get(
    `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:issue`
  )

  return response.data.total_count
}

async function getExtendedGitHubUserInfo(
  username: string
): Promise<ExtendedGitHubUserInfo> {
  const cachedData = readCache(username)

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data
  }

  try {
    const [userInfo, prCount, totalCommits, lastYearCommits, userIssuesCount] =
      await Promise.all([
        getGitHubUserInfo(username),
        getPullRequestCount(username),
        getTotalCommits(username),
        getCommitsByYear(username, new Date().getFullYear() - 1),
        getUserIssuesCount(username),
      ])

    const extendedInfo: ExtendedGitHubUserInfo = {
      ...userInfo,
      commitsLastYear: lastYearCommits,
      pullRequestCount: prCount,
      totalCommits: totalCommits,
      userIssuesCount: userIssuesCount,
    }

    writeCache(username, extendedInfo)

    return extendedInfo
  } catch (error) {
    throw error
  }
}

export async function GET(request: Request) {
  let username

  try {
    const url = new URL(request.url)
    username = url.searchParams.get('username')
  } catch (error) {
    console.error('Error parsing URL:', error, 'URL:', request.url)
    return NextResponse.json(
      {
        error: `Failed to parse URL: ${request.url}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    )
  }

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const userInfo = await getExtendedGitHubUserInfo(username)
    return NextResponse.json(userInfo)
  } catch (error: any) {
    console.error('GitHub User API error:', error)

    // More detailed error response
    const errorMessage = error.message || 'Unknown error'
    const errorStatus = error.status || 500
    const errorResponse = {
      error: `Failed to fetch user information: ${errorMessage}`,
      status: errorStatus,
      path: request.url,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(errorResponse, { status: errorStatus })
  }
}
