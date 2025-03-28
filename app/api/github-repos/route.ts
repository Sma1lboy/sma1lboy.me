import fs from 'fs'
import path from 'path'

import { Octokit } from '@octokit/rest'
import { NextResponse } from 'next/server'

// Use /tmp directory for Vercel serverless functions
const CACHE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'github-repos-cache')
  : path.join(process.cwd(), '.next/cache/github-repos')
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
  try {
    const cacheFile = getCacheFilePath(username)

    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
      return data as CachedData
    }
  } catch (error) {
    console.error('Error reading cache:', error)
    // Continue execution without cache
  }

  return null
}

function writeCache(username: string, data: Repository[]): void {
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
    console.error('Error writing cache:', error)
    // Continue execution without caching
  }
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
    // Check cache first
    const cachedData = readCache(username)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data)
    }

    try {
      // Fetch fresh data
      const repositories = await getUserRepositories(username)
      writeCache(username, repositories)
      return NextResponse.json(repositories)
    } catch (fetchError) {
      console.error('Error fetching fresh data:', fetchError)

      // If we have cached data (even if expired), use it as fallback
      if (cachedData) {
        console.log('Using expired cache as fallback')
        return NextResponse.json(cachedData.data)
      }

      // No fallback available, re-throw the error
      throw fetchError
    }
  } catch (error: any) {
    console.error('GitHub API error:', error)

    // More detailed error response
    const errorMessage = error.message || 'Unknown error'
    const errorStatus = error.status || 500
    const errorResponse = {
      error: `Failed to fetch repositories: ${errorMessage}`,
      status: errorStatus,
      path: request.url,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(errorResponse, { status: errorStatus })
  }
}
