export interface GitHubUserInfo {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface ExtendedGitHubUserInfo extends GitHubUserInfo {
  pullRequestCount: number
  totalCommits: number
  commitsLastYear: number
  userIssuesCount: number
}

export interface UserProfileProps {
  username: string
}

export interface CachedData {
  data: ExtendedGitHubUserInfo
  timestamp: number
}
