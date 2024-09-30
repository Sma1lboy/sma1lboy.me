'use client'

import React, { useEffect } from 'react'

import { Blog } from './Blog'

import { BlogCard } from '@/components/blog/BlogCard'

const BlogCardList = ({ initialBlogs }: { initialBlogs: Blog[] }) => {
  useEffect(() => {}, [])

  return (
    <div className="mx-auto max-w-3xl">
      {initialBlogs.map((b, i) => (
        <BlogCard
          key={i}
          className="my-4"
          date={b.date}
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
