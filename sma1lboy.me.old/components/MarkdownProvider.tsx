'use client'
import { useTheme } from 'next-themes'
import parseMD from 'parse-md'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import CodeBlock from './codeBlock'

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
        'prose-pre:bg-muted prose-pre:rounded prose-pre:px-1',
        'prose-code:bg-muted prose-code:rounded prose-code:px-1',
        theme === 'light'
          ? 'prose-pre:text-gray-100 [&:not(pre)>code]:text-gray-800'
          : 'prose-code:text-foreground prose-pre:text-foreground',
        'prose-td:text-muted-foreground prose-th:text-foreground',
        'prose-hr:border-border'
      )}
      components={{
        // Custom renderer for inline code to handle math notation
        code: ({ node, className, children, ...props }) => {
          const text = String(children).replace(/\n$/, '')

          // Check if this is math notation with subscripts or superscripts
          if (text.includes('_') || text.includes('^')) {
            // Process subscripts (_) and superscripts (^)
            const processedText = text
              // Handle subscripts like h_t or x_{t-1}
              .replace(/([a-zA-Z])_\{([^}]+)\}/g, '$1<sub>$2</sub>')
              .replace(/([a-zA-Z])_([a-zA-Z0-9-]+)/g, '$1<sub>$2</sub>')
              // Handle superscripts like x^2 or x^{n+1}
              .replace(/([a-zA-Z0-9])^\{([^}]+)\}/g, '$1<sup>$2</sup>')
              .replace(/([a-zA-Z0-9])\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>')

            return (
              <code className={className} {...props}>
                <span dangerouslySetInnerHTML={{ __html: processedText }} />
              </code>
            )
          }

          // Regular inline code
          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },

        // Add copy button to code blocks
        pre: ({ node, className, children, ...props }) => {
          // Extract language from className (if available)
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : undefined

          return (
            <CodeBlock className={className} language={language} {...props}>
              {children}
            </CodeBlock>
          )
        },
      }}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  )
}

export default MarkdownNote
