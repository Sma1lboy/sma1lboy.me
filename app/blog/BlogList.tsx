'use client'

import React, { useEffect } from 'react'

import { Blog } from './Blog'

import { BlogCard } from '@/components/blog/BlogCard'

const BlogList = ({ initialBlogs }: { initialBlogs: Blog[] }) => {
  useEffect(() => {}, [])

  return (
    <div>
      {initialBlogs.map((b, i) => (
        <BlogCard
          key={i}
          className="my-4"
          description={b.description}
          title={b.title}
        />
      ))}
    </div>
  )
}

export default BlogList
