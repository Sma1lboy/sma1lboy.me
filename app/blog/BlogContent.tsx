'use client'
import React, { useState, useMemo } from 'react'
import { Pagination, Input } from '@nextui-org/react'
import { SearchIcon } from 'lucide-react'

import { Blog } from './Blog'
import BlogCardList from './BlogCardList'

import { siteConfig } from '@/config/siteConfig'

export const BlogContent = ({ blogs }: { blogs: Blog[] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const notesPerPage = siteConfig.maxNotesPerPage

  const filteredAndSortedBlogs = useMemo(() => {
    return blogs.filter(
      blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.description &&
          blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [blogs, searchQuery])

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * notesPerPage

    return filteredAndSortedBlogs.slice(startIndex, startIndex + notesPerPage)
  }, [filteredAndSortedBlogs, currentPage, notesPerPage])

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / notesPerPage)

  return (
    <div className="mx-auto max-w-3xl px-5 py-4">
      <div className="mb-6">
        <Input
          classNames={{
            base: 'max-w-full h-10',
            input: 'text-small',
            inputWrapper:
              'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            mainWrapper: 'h-full',
          }}
          placeholder="Search blogs..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </div>

      <BlogCardList initialBlogs={paginatedBlogs} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            isCompact
            showControls
            initialPage={1}
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      )}

      <div className="mt-6 text-center">
        <a
          className="font-serif text-primary transition-colors hover:text-primary-400"
          href="https://blog.sma1lboy.me"
          rel="noopener noreferrer"
          target="_blank"
        >
          Go to Full version of blog Web
        </a>
      </div>
    </div>
  )
}
