import React from 'react'

import { ProjectContent } from './ProjectContent'
import { Repository } from './Repository'

import { defaultConfig } from '@/config/siteConfig'

export const revalidate = 86400 // 24 hours

async function ProjectPage() {
  // Use URL constructor to ensure proper URL formatting
  const apiUrl = new URL(
    '/api/github-repos',
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  )
  apiUrl.searchParams.append('username', defaultConfig.name)

  const response = await fetch(apiUrl.toString(), { cache: 'no-store' })

  if (!response.ok) {
    throw new Error('Failed to fetch repositories')
  }

  const repos: Repository[] = await response.json()
  return <ProjectContent repos={repos} />
}

export default ProjectPage
