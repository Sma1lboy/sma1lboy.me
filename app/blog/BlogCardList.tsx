'use client'
import React, { useEffect, useState } from 'react'

import { Blog } from './Blog'

import { BlogCard } from '@/components/blog/BlogCard'

const BlogCardList = ({ initialBlogs }: { initialBlogs: Blog[] }) => {
  const [sortedBlogs, setSortedBlogs] = useState<Blog[]>(initialBlogs)

  useEffect(() => {
    const sorted = [...initialBlogs].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1

      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setSortedBlogs(sorted)
  }, [initialBlogs])

  return (
    <div className="mx-auto max-w-3xl">
      {sortedBlogs.map((b, i) => (
        <BlogCard
          key={i}
          className="my-4"
          date={b.date || 'No date'}
          description={b.description}
          slug={b.slug}
          title={b.title}
        />
      ))}
      <div className="mt-4">
        <a
          className="font-serif text-gray-700 hover:text-gray-300"
          href="https://blog.sma1lboy.me"
        >
          Go to Full version of blog Web
        </a>
      </div>
    </div>
  )
}

export default BlogCardList
