/**
 * Minimal GitHub REST API types — only fields actually consumed by the app.
 * (Replaces @octokit/rest to keep it out of the bundle.)
 */
export interface GitHubUserData {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  blog: string | null;
  location: string | null;
  company: string | null;
  created_at: string;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string | null;
  fork: boolean;
}

/**
 * GitHub contribution data interface (custom since GitHub's contribution API requires GraphQL)
 */
export interface GitHubContribution {
  date: string;
  contributionCount: number;
}

/**
 * GraphQL pinned repository node type
 */
interface GraphQLPinnedRepoNode {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
  } | null;
  updatedAt: string;
  isFork: boolean;
}

/**
 * Complete GitHub data cache interface using Octokit native types
 */
export interface GitHubDataCache {
  user: GitHubUserData;
  repos: GitHubRepo[];
  contributions: GitHubContribution[];
  totalContributions: number;
  lastUpdated: number;
}

/**
 * GitHub API service class with caching
 */
class GitHubApiService {
  private cache: GitHubDataCache | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "sma1lboy";
  private readonly REPOS_FETCH_LIMIT = 100; // Fetch up to 100 repos to ensure good selection
  private readonly REPOS_RESULT_LIMIT = 30; // Return top 30 starred repos
  private intervalId: NodeJS.Timeout | null = null;

  /** Plain fetch against GitHub REST API; token optional for higher rate limits */
  private async restGet<T>(path: string): Promise<T> {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const response = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  }

  /**
   * Start automatic data fetching every 30 minutes
   */
  startAutoRefresh(): void {
    // Initial fetch
    this.refreshCache();

    // Set up interval for every 30 minutes
    this.intervalId = setInterval(() => {
      this.refreshCache();
    }, this.CACHE_DURATION);

    console.log("GitHub API auto-refresh started (every 30 minutes)");
  }

  /**
   * Stop automatic data fetching
   */
  stopAutoRefresh(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("GitHub API auto-refresh stopped");
    }
  }

  /**
   * Get cached GitHub data or fetch if cache is stale/empty
   */
  async getGitHubData(): Promise<GitHubDataCache | null> {
    if (this.isCacheValid()) {
      return this.cache;
    }

    return await this.refreshCache();
  }

  /**
   * Check if current cache is still valid
   */
  private isCacheValid(): boolean {
    if (!this.cache) return false;

    const now = Date.now();
    return now - this.cache.lastUpdated < this.CACHE_DURATION;
  }

  /**
   * Try to fetch pinned repositories using GraphQL API
   * Falls back to REST API if GraphQL fails or no token is available
   */
  private async getPinnedRepos(): Promise<GitHubRepo[]> {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      // No token, use REST API fallback
      return this.getTopStarredRepos();
    }

    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  id
                  name
                  description
                  url
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                  }
                  updatedAt
                  isFork
                }
              }
            }
          }
        }
      `;

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables: { username: this.USERNAME },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.warn("GraphQL error, falling back to REST API:", data.errors);
        return this.getTopStarredRepos();
      }

      const pinnedRepos = (data.data?.user?.pinnedItems?.nodes || []) as GraphQLPinnedRepoNode[];
      if (pinnedRepos.length > 0) {
        // Transform GraphQL response to match REST API format
        return pinnedRepos.map((repo) => ({
          id: parseInt(repo.id.replace(/\D/g, "")) || 0,
          name: repo.name,
          description: repo.description,
          html_url: repo.url,
          stargazers_count: repo.stargazerCount,
          forks_count: repo.forkCount,
          language: repo.primaryLanguage?.name || null,
          updated_at: repo.updatedAt,
          fork: repo.isFork,
        })) as GitHubRepo[];
      }

      return this.getTopStarredRepos();
    } catch (error) {
      console.warn("Failed to fetch pinned repos via GraphQL, falling back to REST API:", error);
      return this.getTopStarredRepos();
    }
  }

  /**
   * Get top starred repositories as fallback
   */
  private async getTopStarredRepos(): Promise<GitHubRepo[]> {
    const repos = await this.restGet<GitHubRepo[]>(
      `/users/${this.USERNAME}/repos?per_page=${this.REPOS_FETCH_LIMIT}`,
    );
    // Sort by stars in descending order and take top repos
    return repos
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, this.REPOS_RESULT_LIMIT);
  }

  /**
   * Fetch fresh data from GitHub API and update cache
   */
  private async refreshCache(): Promise<GitHubDataCache | null> {
    try {
      console.log("Fetching fresh GitHub data...");

      // Fetch user data
      const user = await this.restGet<GitHubUserData>(`/users/${this.USERNAME}`);

      // Fetch repositories - try pinned repos first, fallback to top starred
      const repos = await this.getPinnedRepos();

      // Generate mock contribution data (GitHub's contribution API requires GraphQL and authentication)
      const contributions = this.generateMockContributions();

      // Calculate total contributions
      const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);

      // Update cache
      this.cache = {
        user,
        repos,
        contributions,
        totalContributions,
        lastUpdated: Date.now(),
      };

      console.log(`GitHub data refreshed successfully. Total contributions: ${totalContributions}`);
      return this.cache;
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error);

      // Return existing cache if available, even if stale
      if (this.cache) {
        console.log("Returning stale cache data due to API error");
        return this.cache;
      }

      return null;
    }
  }

  /**
   * Generate mock contribution data for the past year
   * Note: Real contribution data requires GitHub GraphQL API with authentication
   */
  private generateMockContributions(): GitHubContribution[] {
    const contributions: GitHubContribution[] = [];
    const today = new Date();

    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic contribution pattern
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let contributionCount = 0;
      if (!isWeekend) {
        // Higher chance of contributions on weekdays
        const random = Math.random();
        if (random > 0.3) {
          contributionCount = Math.floor(Math.random() * 8) + 1;
        }
      } else {
        // Lower chance on weekends
        const random = Math.random();
        if (random > 0.7) {
          contributionCount = Math.floor(Math.random() * 3) + 1;
        }
      }

      contributions.push({
        date: date.toISOString().split("T")[0],
        contributionCount,
      });
    }

    return contributions;
  }

  /**
   * Get user data from cache
   */
  getUserData(): GitHubUserData | null {
    return this.cache?.user || null;
  }

  /**
   * Get repositories from cache
   */
  getRepositories(): GitHubRepo[] {
    return this.cache?.repos || [];
  }

  /**
   * Get contribution data from cache
   */
  getContributions(): GitHubContribution[] {
    return this.cache?.contributions || [];
  }

  /**
   * Get total contributions count
   */
  getTotalContributions(): number {
    return this.cache?.totalContributions || 0;
  }

  /**
   * Get cache last updated timestamp
   */
  getLastUpdated(): number | null {
    return this.cache?.lastUpdated || null;
  }
}

// Create singleton instance
export const githubApiService = new GitHubApiService();

// Auto-start the refresh cycle (you can call this from your app initialization)
export const startGitHubDataSync = () => {
  githubApiService.startAutoRefresh();
};

export const stopGitHubDataSync = () => {
  githubApiService.stopAutoRefresh();
};
