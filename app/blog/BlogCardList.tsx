'use client'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

import { Blog } from './Blog'

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
    <div className="mx-auto space-y-4">
      {sortedBlogs.map((b, i) => (
        <div key={i}>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <a className="hover:underline" href={`/blog/${b.slug}`}>
                <h3 className="prose prose-xl prose-stone dark:prose-invert">
                  {b.title}
                </h3>
              </a>
              {b.date && (
                <span className="text-sm text-gray-500">
                  {formatRelativeDate(b.date)}
                </span>
              )}
            </div>
            <div className="pt-2">
              <p>{b.description}</p>
            </div>
          </div>
          {i < sortedBlogs.length - 1 && (
            <div className="my-4 border-t border-white/10" />
          )}
        </div>
      ))}
    </div>
  )
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffInDays < 5) {
    return formatDistanceToNow(date, { addSuffix: true })
  } else {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}

export default BlogCardList
