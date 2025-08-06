import { useState, useEffect } from "react";
import { githubApiService, GitHubDataCache } from "../services/githubApi";

/**
 * Custom hook for accessing GitHub data with loading and error states
 */
export function useGitHub() {
  const [data, setData] = useState<GitHubDataCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const githubData = await githubApiService.getGitHubData();

        if (githubData) {
          setData(githubData);
        } else {
          setError("Failed to fetch GitHub data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("GitHub data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    // Helper methods for easy access to specific data
    user: data?.user || null,
    repos: data?.repos || [],
    contributions: data?.contributions || [],
    totalContributions: data?.totalContributions || 0,
    lastUpdated: data?.lastUpdated || null,
  };
}

/**
 * Hook specifically for user data
 */
export function useGitHubUser() {
  const { user, loading, error } = useGitHub();
  return { user, loading, error };
}

/**
 * Hook specifically for repository data
 */
export function useGitHubRepos() {
  const { repos, loading, error } = useGitHub();
  return { repos, loading, error };
}

/**
 * Hook specifically for contribution data
 */
export function useGitHubContributions() {
  const { contributions, totalContributions, loading, error } = useGitHub();
  return { contributions, totalContributions, loading, error };
}
