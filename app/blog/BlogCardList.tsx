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
    <div className="mx-auto">
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
    </div>
  )
}

export default BlogCardList
