'use client'
import React, { useState, useMemo } from 'react'
import Masonry from 'react-masonry-css'
import { Tabs, Tab, Pagination, Input } from '@nextui-org/react'
import { SearchIcon } from 'lucide-react'

import { ProjectCard } from './ProjectCard'
import { Repository } from './Repository'

import { siteConfig } from '@/config/siteConfig'

export interface ProjectContentProps {
  repos: Repository[]
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ repos }) => {
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'forks'>('stars')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const maxProjectPerPage = siteConfig.maxProjectsPerPage || 30

  const breakpointColumnsObj = {
    1100: 3,
    500: 1,
    700: 2,
    default: 4,
  }

  const filteredAndSortedRepos = useMemo(() => {
    return [...repos]
      .filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'stars':
            return b.stars - a.stars
          case 'updated':
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
          case 'forks':
            return b.forks - a.forks
          default:
            return 0
        }
      })
  }, [repos, sortBy, searchQuery])

  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * maxProjectPerPage

    return filteredAndSortedRepos.slice(
      startIndex,
      startIndex + maxProjectPerPage
    )
  }, [filteredAndSortedRepos, currentPage, maxProjectPerPage])

  const totalPages = Math.ceil(
    filteredAndSortedRepos.length / maxProjectPerPage
  )

  const sortOptions = [
    { key: 'stars', label: 'Stars' },
    { key: 'updated', label: 'Last Updated' },
    { key: 'forks', label: 'Forks' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-7">
      <div className="mb-4 flex items-center justify-between">
        <Tabs
          aria-label="Sort options"
          color="primary"
          selectedKey={sortBy}
          variant="underlined"
          onSelectionChange={key =>
            setSortBy(key as 'stars' | 'updated' | 'forks')
          }
        >
          {sortOptions.map(option => (
            <Tab key={option.key} title={option.label} />
          ))}
        </Tabs>
        <Input
          classNames={{
            base: 'max-w-[300px] h-10',
            input: 'text-small',
            inputWrapper:
              'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            mainWrapper: 'h-full',
          }}
          placeholder="Search repositories..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="ml-[-16px] flex w-auto"
        columnClassName="pl-[16px] bg-clip-padding"
      >
        {paginatedRepos.map(repo => (
          <div key={repo.id} className="mb-4">
            <ProjectCard
              description={repo.description || 'No description available'}
              forks={repo.forks}
              isOrg={repo.isOrg}
              language={repo.language || 'Unknown'}
              name={repo.name}
              owner={repo.owner}
              stars={repo.stars}
              updatedAt={repo.updatedAt}
              url={repo.url}
            />
          </div>
        ))}
      </Masonry>
      <div className="mt-8 flex justify-center">
        <Pagination
          initialPage={1}
          page={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
