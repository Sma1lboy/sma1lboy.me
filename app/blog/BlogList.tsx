'use client'

import React, { useState, useEffect } from 'react'
import { BlogCard } from '@/components/blog/BlogCard'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Blog {
  title: string
  description: string
  content: string
}

const BlogList = ({ initialBlogs }: { initialBlogs: Blog[] }) => {
  useEffect(() => {}, [])

  console.log(initialBlogs[2].content)
  return (
    <div>
      {initialBlogs.map((b, i) => (
        <BlogCard
          className="my-4"
          key={i}
          title={b.title}
          description={b.description}
        />
      ))}
    </div>
  )
}

export default BlogList
