import fs from 'fs'
import path from 'path'

import { Octokit } from '@octokit/rest'
import { NextResponse } from 'next/server'

// Define cache directories more statically to avoid linting warnings
const TMP_CACHE_DIR = '/tmp/github-repos-cache'
const LOCAL_CACHE_DIR = './.next/cache/github-repos'

// Use /tmp directory for Vercel serverless functions
const CACHE_DIR = process.env.VERCEL ? TMP_CACHE_DIR : LOCAL_CACHE_DIR
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
  // Sanitize username to avoid path traversal issues
  const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, '_')
  return path.join(CACHE_DIR, `${sanitizedUsername}-repos.json`)
}

function readCache(username: string): CachedData | null {
  try {
    const cacheFile = getCacheFilePath(username)

    // Check if file exists before reading
    try {
      if (fs.existsSync(cacheFile)) {
        const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
        return data as CachedData
      }
    } catch (fsError) {
      console.error('File system error when reading cache:', fsError)
      // Continue without cache on file system errors
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

    // Create cache directory safely
    try {
      // Check if directory exists and create if needed
      const dirExists = fs.existsSync(CACHE_DIR)
      if (!dirExists) {
        fs.mkdirSync(CACHE_DIR, { recursive: true })
      }

      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      }

      fs.writeFileSync(cacheFile, JSON.stringify(cacheData))
    } catch (fsError) {
      console.error('File system error when writing cache:', fsError)
      // Continue without caching on file system errors
    }
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
  // Check if GitHub token is available
  const githubToken = process.env.GITHUB_TOKEN
  const octokitOptions = githubToken ? { auth: githubToken } : {}

  if (!githubToken) {
    console.warn(
      'No GitHub token found. API rate limits may apply and organization access may be limited.'
    )
  } else {
    console.log('Using GitHub token for authentication')

    // Test token permissions
    try {
      const octokit = new Octokit(octokitOptions)
      const { headers } = await octokit.request('GET /rate_limit')
      const scopes = headers['x-oauth-scopes'] || ''
      console.log(`[GitHub API] Token scopes: ${scopes}`)

      if (!scopes.includes('read:org')) {
        console.warn(
          '[GitHub API] Token does not have read:org scope. Organization repositories may not be accessible.'
        )
      }
    } catch (error) {
      console.error('[GitHub API] Error checking token permissions:', error)
    }
  }

  const octokit = new Octokit(octokitOptions)
  // Use a Map to avoid duplicate repositories
  const repoMap = new Map<number, Repository>()

  try {
    // 1. Get user repositories
    console.log(`Fetching repositories for user: ${username}`)
    try {
      const { data: userRepos } = await octokit.repos.listForUser({
        username,
        per_page: 100,
        sort: 'updated',
        type: 'all', // Get all accessible repositories
      })

      console.log(`Found ${userRepos.length} repositories for user ${username}`)

      // Add to map to avoid duplicates
      userRepos.forEach(repo => {
        const processedRepo = processRepoData(repo, repo.owner.login, false)
        repoMap.set(repo.id, processedRepo)
      })
    } catch (userRepoError) {
      console.error('Error fetching user repositories:', userRepoError)
    }

    // 2. Get repositories the user has contributed to
    if (githubToken) {
      try {
        console.log(`Fetching repositories user ${username} has contributed to`)

        // This endpoint requires authentication and returns repos the authenticated user has contributed to
        const { data: contributedRepos } =
          await octokit.repos.listForAuthenticatedUser({
            per_page: 100,
            sort: 'updated',
            affiliation: 'collaborator,organization_member',
          })

        console.log(
          `Found ${contributedRepos.length} repositories user has contributed to`
        )

        // Add to map to avoid duplicates
        contributedRepos.forEach(repo => {
          const isOrg = repo.owner.type === 'Organization'
          const processedRepo = processRepoData(repo, repo.owner.login, isOrg)
          repoMap.set(repo.id, processedRepo)
        })
      } catch (contributedError) {
        console.error(
          'Error fetching contributed repositories:',
          contributedError
        )
      }
    }

    // 3. Get organization repositories
    try {
      console.log(`Fetching organizations for user: ${username}`)
      const { data: userOrgs } = await octokit.orgs.listForUser({ username })
      console.log(`Found ${userOrgs.length} organizations for user ${username}`)

      for (const org of userOrgs) {
        try {
          console.log(`Fetching repositories for organization: ${org.login}`)
          const { data: orgRepos } = await octokit.repos.listForOrg({
            org: org.login,
            per_page: 100,
            sort: 'updated',
            type: 'all', // Try to get all repos the user has access to
          })

          console.log(
            `Found ${orgRepos.length} repositories for organization ${org.login}`
          )

          // Add to map to avoid duplicates
          orgRepos.forEach(repo => {
            const processedRepo = processRepoData(repo, org.login, true)
            repoMap.set(repo.id, processedRepo)
          })
        } catch (orgError) {
          console.error(`Error fetching repos for org ${org.login}:`, orgError)
          // Continue with other orgs even if one fails
        }
      }
    } catch (orgsError) {
      console.error('Error fetching user organizations:', orgsError)
    }

    // Convert map to array
    const repositories = Array.from(repoMap.values())

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

  // Log the request for debugging
  console.log(`[GitHub API] Request received for username: ${username}`)
  console.log(
    `[GitHub API] Environment: ${process.env.VERCEL ? 'Vercel' : 'Local'}`
  )
  console.log(
    `[GitHub API] GitHub Token Present: ${process.env.GITHUB_TOKEN ? 'Yes' : 'No'}`
  )
  console.log(`[GitHub API] Cache Directory: ${CACHE_DIR}`)

  try {
    // Check cache first
    const cachedData = readCache(username)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data)
    }

    try {
      // Fetch fresh data
      const repositories = await getUserRepositories(username)

      // Log repository stats for debugging
      const orgRepos = repositories.filter(repo => repo.isOrg)
      const userRepos = repositories.filter(repo => !repo.isOrg)
      console.log(
        `[GitHub API] Total repositories found: ${repositories.length}`
      )
      console.log(`[GitHub API] User repositories: ${userRepos.length}`)
      console.log(`[GitHub API] Organization repositories: ${orgRepos.length}`)

      if (orgRepos.length > 0) {
        // Get unique organization names without using spread operator on Set
        const orgOwners = orgRepos.map(repo => repo.owner)
        const uniqueOrgs = Array.from(new Set(orgOwners))
        console.log(
          `[GitHub API] Organizations found: ${uniqueOrgs.join(', ')}`
        )
      } else {
        console.log(`[GitHub API] No organization repositories found`)
      }

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
