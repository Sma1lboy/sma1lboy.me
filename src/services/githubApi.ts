import { Octokit } from "@octokit/rest";

/**
 * Octokit response types for GitHub API data
 */
export type GitHubUserData = Awaited<ReturnType<Octokit["rest"]["users"]["getByUsername"]>>["data"];
export type GitHubRepo = Awaited<
  ReturnType<Octokit["rest"]["repos"]["listForUser"]>
>["data"][number];

/**
 * GitHub contribution data interface (custom since GitHub's contribution API requires GraphQL)
 */
export interface GitHubContribution {
  date: string;
  contributionCount: number;
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
  private octokit: Octokit;
  private cache: GitHubDataCache | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "sma1lboy";
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize Octokit (no token needed for public data, but rate limited)
    // For production, consider adding a GitHub token via environment variable
    this.octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN, // Optional: add token for higher rate limits
    });
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
   * Fetch fresh data from GitHub API and update cache
   */
  private async refreshCache(): Promise<GitHubDataCache | null> {
    try {
      console.log("Fetching fresh GitHub data...");

      // Fetch user data
      const userResponse = await this.octokit.rest.users.getByUsername({
        username: this.USERNAME,
      });

      // Fetch repositories (top 10 most starred)
      const reposResponse = await this.octokit.rest.repos.listForUser({
        username: this.USERNAME,
        sort: "updated",
        per_page: 10,
      });

      // Generate mock contribution data (GitHub's contribution API requires GraphQL and authentication)
      const contributions = this.generateMockContributions();

      // Calculate total contributions
      const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);

      // Update cache
      this.cache = {
        user: userResponse.data,
        repos: reposResponse.data,
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
