'use client'
import React, { useState, useMemo, Key } from 'react'
import { Tabs, Tab, Pagination, Input } from '@nextui-org/react'
import { SearchIcon, GitFork, Star, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Repository } from './Repository'

import { defaultConfig } from '@/config/siteConfig'

export interface ProjectContentProps {
  repos: Repository[]
}
export type SortType = 'stars' | 'updated' | 'forks'
export const ProjectContent: React.FC<ProjectContentProps> = ({ repos }) => {
  const [sortBy, setSortBy] = useState<SortType>('stars')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const maxProjectPerPage = defaultConfig.maxProjectsPerPage || 30

  const [activeHighlight, setActiveHighlight] = useState<SortType | null>(null)

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

  const handleSortChange = (key: Key) => {
    setSortBy(key as SortType)
    setActiveHighlight(key as SortType)
  }

  return (
    <div className="mx-auto max-w-4xl px-7">
      <div className="mb-6 flex items-center justify-between">
        <Tabs
          aria-label="Sort options"
          color="primary"
          selectedKey={sortBy}
          variant="underlined"
          onSelectionChange={handleSortChange}
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

      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {paginatedRepos.map(repo => (
            <motion.div
              key={repo.id}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <a
                      className="text-xl font-medium text-primary hover:underline"
                      href={repo.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {repo.owner}/{repo.name}
                    </a>
                    {repo.isOrg && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Organization
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <motion.div
                      animate={{
                        scale: activeHighlight === 'stars' ? 1.1 : 1,
                      }}
                      className={`flex items-center gap-1 transition-colors duration-300 ${
                        activeHighlight === 'stars' ? 'text-purple-600' : ''
                      }`}
                    >
                      <Star size={16} />
                      <span>{repo.stars}</span>
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: activeHighlight === 'forks' ? 1.1 : 1,
                      }}
                      className={`flex items-center gap-1 transition-colors duration-300 ${
                        activeHighlight === 'forks' ? 'text-purple-600' : ''
                      }`}
                    >
                      <GitFork size={16} />
                      <span>{repo.forks}</span>
                    </motion.div>
                  </div>
                </div>

                <p className="text-gray-600">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <motion.div
                    animate={{
                      scale: activeHighlight === 'updated' ? 1.05 : 1,
                    }}
                    className={`flex items-center gap-1 transition-colors duration-300 ${
                      activeHighlight === 'updated'
                        ? 'font-bold text-purple-400'
                        : ''
                    }`}
                  >
                    <Calendar size={16} />
                    <span>
                      Updated {new Date(repo.updatedAt).toLocaleDateString()}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

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
