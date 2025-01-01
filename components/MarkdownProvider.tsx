'use client'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parseMD from 'parse-md'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

export const MarkdownNote = ({ children }: { children: string }) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { content } = parseMD(children)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Markdown
      className={cn(
        'prose w-full max-w-none',
        theme === 'light' && 'prose-stone',
        theme === 'dark' && 'prose-invert',
        'prose-pre:bg-muted prose-pre:border-border prose-pre:border',
        'prose-a:text-primary hover:prose-a:text-primary/80',
        'prose-headings:text-foreground',
        'prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary',
        'prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:text-foreground',
        'prose-td:text-muted-foreground prose-th:text-foreground',
        'prose-hr:border-border'
      )}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  )
}

export default MarkdownNote
