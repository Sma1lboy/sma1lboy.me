'use client'
import React, { useState, useMemo } from 'react'
import { Input } from '@nextui-org/react'
import { SearchIcon } from 'lucide-react'

import { Blog } from './Blog'
import BlogCardList from './BlogCardList'

export const BlogContent = ({ blogs }: { blogs: Blog[] }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBlogs = useMemo(() => {
    return blogs.filter(
      blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.description &&
          blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [blogs, searchQuery])

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-5 py-8">
      <div className="mb-8">
        <Input
          classNames={{
            base: 'max-w-full h-12',
            input: 'text-medium',
            inputWrapper:
              'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 hover:bg-default-400/30 dark:hover:bg-default-500/30',
            mainWrapper: 'h-full',
          }}
          placeholder="Search blogs..."
          size="md"
          startContent={<SearchIcon className="text-default-500" size={20} />}
          type="search"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </div>

      <BlogCardList initialBlogs={filteredBlogs} />

      <div className="mt-8 text-center">
        <a
          className="inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3 hover:text-primary-400"
          href="https://blog.sma1lboy.me"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Go to Full version of blog Web</span>
          <svg
            className="lucide lucide-arrow-right"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}
