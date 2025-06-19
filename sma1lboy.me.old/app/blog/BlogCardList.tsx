'use client'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useTheme } from 'next-themes'

import { Blog } from './type'

import { cn } from '@/lib/utils'

const BlogCardList = ({ initialBlogs }: { initialBlogs: Blog[] }) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sortedBlogs, setSortedBlogs] = useState<Blog[]>(initialBlogs)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const sorted = [...initialBlogs].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1

      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setSortedBlogs(sorted)
  }, [initialBlogs])

  if (!mounted) {
    return null
  }

  return (
    <div className="mx-auto space-y-4">
      {sortedBlogs.map((b, i) => (
        <div key={i}>
          <div
            className={cn(
              'rounded-lg p-4 backdrop-blur-sm',
              'transition-colors duration-200',
              'border-border border',
              theme === 'dark'
                ? 'bg-card/30 hover:bg-card/50'
                : 'bg-background/80 hover:bg-background'
            )}
          >
            <div className="flex items-center justify-between">
              <a className="group" href={`/blog/${b.slug}`}>
                <h3
                  className={cn(
                    'text-xl font-semibold',
                    'group-hover:underline',
                    'text-foreground'
                  )}
                >
                  {b.title}
                </h3>
              </a>
              {b.date && (
                <span className="text-muted-foreground text-sm">
                  {formatRelativeDate(b.date)}
                </span>
              )}
            </div>
            <div className="pt-2">
              <p className="text-muted-foreground">{b.description}</p>
            </div>
          </div>
          {i < sortedBlogs.length - 1 && (
            <div className="border-border my-4 border-t" />
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
