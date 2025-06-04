'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from './ui/8bit/button'

import { defaultTheme } from '@/app/generateTheme'

export const ResumeButton = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themeColors = mounted
    ? defaultTheme[theme as 'light' | 'dark'].colors
    : defaultTheme['light'].colors

  return (
    <a href="/resume.pdf" rel="noopener noreferrer" target="_blank">
      <Button
        font="retro"
        className="inline-flex flex-row items-center whitespace-nowrap"
      >
        Resume
      </Button>
    </a>
  )
}
