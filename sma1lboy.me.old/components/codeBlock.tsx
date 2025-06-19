'use client'
import { Check, Copy } from 'lucide-react'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  language?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  language,
}) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    // Extract text content from children
    let code = ''

    React.Children.forEach(children, child => {
      if (typeof child === 'string') {
        code += child
      }
    })

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy code: ', err)
      })
  }

  return (
    <div className="group relative">
      <pre className={cn('relative', className)}>{children}</pre>
      <button
        aria-label="Copy code to clipboard"
        className="absolute right-2 top-2 rounded-md bg-primary/10 p-1.5 text-primary opacity-0 transition-opacity hover:bg-primary/20 group-hover:opacity-100"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      {language && (
        <div className="absolute right-2 top-[calc(100%-1.5rem)] rounded-t-md bg-primary/10 px-2 py-0.5 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {language}
        </div>
      )}
    </div>
  )
}

export default CodeBlock
