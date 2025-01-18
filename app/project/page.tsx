import React from 'react'

import { ProjectContent } from './ProjectContent'
import { Repository } from './Repository'

import { defaultConfig } from '@/config/siteConfig'

export const revalidate = 86400 // 24 hours

async function getRepos(): Promise<Repository[]> {
  const response = await fetch(
    `/api/github-repos?username=${defaultConfig.name}`,
    {
      next: { revalidate: 86400 }, // 24 hours cache
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch repositories')
  }

  return response.json()
}

async function ProjectPage() {
  const repos = await getRepos()
  return <ProjectContent repos={repos} />
}

export default ProjectPage
