import fs from 'fs'
import path from 'path'

import { Octokit } from '@octokit/rest'
import { NextResponse } from 'next/server'

const CACHE_DIR = path.join(process.cwd(), '.next/cache/github-repos')
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface Repository {
  description: string | null
  forks: number
  id: number
  isOrg: boolean
  language: string | null
  name: string
  owner: string
  stars: number
  updatedAt: string
  url: string
}

interface CachedData {
  data: Repository[]
  timestamp: number
}

function getCacheFilePath(username: string): string {
  return path.join(CACHE_DIR, `${username}-repos.json`)
}

function readCache(username: string): CachedData | null {
  const cacheFile = getCacheFilePath(username)

  if (fs.existsSync(cacheFile)) {
    const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    return data as CachedData
  }

  return null
}

function writeCache(username: string, data: Repository[]): void {
  const cacheFile = getCacheFilePath(username)

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }

  const cacheData: CachedData = {
    data,
    timestamp: Date.now(),
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cacheData))
}

function processRepoData(
  repoData: any,
  owner: string,
  isOrg: boolean
): Repository {
  return {
    description: repoData.description,
    forks: repoData.forks_count,
    id: repoData.id,
    isOrg,
    language: repoData.language,
    name: repoData.name,
    owner,
    stars: repoData.stargazers_count,
    updatedAt: repoData.pushed_at,
    url: repoData.html_url,
  }
}

async function getUserRepositories(username: string): Promise<Repository[]> {
  const octokitOptions = process.env.GITHUB_TOKEN
    ? { auth: process.env.GITHUB_TOKEN }
    : {}
  const octokit = new Octokit(octokitOptions)
  let repositories: Repository[] = []

  try {
    // Get user repositories
    const { data: userRepos } = await octokit.repos.listForUser({
      username,
      per_page: 100,
      sort: 'updated',
    })

    repositories = userRepos.map(repo => processRepoData(repo, username, false))

    // Get organization repositories
    const { data: userOrgs } = await octokit.orgs.listForUser({ username })

    for (const org of userOrgs) {
      const { data: orgRepos } = await octokit.repos.listForOrg({
        org: org.login,
        per_page: 100,
        sort: 'updated',
      })

      repositories.push(
        ...orgRepos.map(repo => processRepoData(repo, org.login, true))
      )
    }

    // Sort by stars
    repositories.sort((a, b) => b.stars - a.stars)

    return repositories
  } catch (error) {
    console.error('Error fetching repositories:', error)
    throw error
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // Check cache first
    const cachedData = readCache(username)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data)
    }

    // Fetch fresh data
    const repositories = await getUserRepositories(username)
    writeCache(username, repositories)

    return NextResponse.json(repositories)
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch repositories: ${error.message}` },
      { status: error.status || 500 }
    )
  }
}
