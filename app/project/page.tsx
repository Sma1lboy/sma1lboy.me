import React from 'react'

import { ProjectContent } from './ProjectContent'
import { Repository } from './Repository'

import { defaultConfig } from '@/config/siteConfig'

export const revalidate = 86400 // 24 hours

async function ProjectPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/github-repos?username=${defaultConfig.name}`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch repositories')
  }

  const repos: Repository[] = await response.json()
  return <ProjectContent repos={repos} />
}

export default ProjectPage
