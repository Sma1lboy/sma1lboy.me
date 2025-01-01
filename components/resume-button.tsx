'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import PulsatingButton from './ui/pulsating-button'

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
      <PulsatingButton
        className="inline-flex flex-row items-center whitespace-nowrap rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-primary dark:bg-background dark:text-primary"
        pulseColor={themeColors.primary.DEFAULT}
      >
        Resume
      </PulsatingButton>
    </a>
  )
}
