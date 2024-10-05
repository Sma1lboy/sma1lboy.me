import { Octokit } from '@octokit/rest'

import { ProjectContent } from './ProjectContent'
import { Repository } from './Repository'

import { siteConfig } from '@/config/siteConfig'

const octokit = new Octokit()

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
  let repositories: Repository[] = []

  const { data: userRepos } = await octokit.repos.listForUser({
    per_page: 100,
    username,
  })

  for (const repo of userRepos) {
    const { data: repoData } = await octokit.repos.get({
      owner: username,
      repo: repo.name,
    })

    repositories.push(processRepoData(repoData, username, false))
  }

  const { data: userOrgs } = await octokit.orgs.listForUser({ username })

  for (const org of userOrgs) {
    const { data: orgRepos } = await octokit.repos.listForOrg({
      org: org.login,
    })

    for (const repo of orgRepos) {
      const { data: repoData } = await octokit.repos.get({
        owner: org.login,
        repo: repo.name,
      })

      repositories.push(processRepoData(repoData, org.login, true))
    }
  }

  repositories = repositories.sort((a, b) => b.stars - a.stars)

  return repositories
}

const ProjectPage = async () => {
  const repos = await getUserRepositories(siteConfig.name)

  return <ProjectContent repos={repos} />
}

export default ProjectPage
