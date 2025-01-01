'use client'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconHome,
  IconCode,
  IconArticle,
  IconArrowBack,
  IconSun,
  IconMoon,
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { FloatingDock } from './floating-dock'

import { defaultConfig } from '@/config/siteConfig'
import { defaultTheme } from '@/app/generateTheme'

const getIconForPath = (href: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    '/blog': <IconArticle className="h-full w-full" />,
    '/home': <IconHome className="h-full w-full" />,
    '/project': <IconCode className="h-full w-full" />,
  }

  return iconMap[href] || <IconHome className="h-full w-full" />
}

export const FloatingNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const defaultPage = defaultConfig.navItems.find(item => item.default)
  const isHome = pathname === '/' || pathname === defaultPage?.href
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themeColors = mounted
    ? defaultTheme[theme as 'light' | 'dark'].colors
    : defaultTheme['light'].colors

  const getThemeIcon = () => {
    if (!mounted) return <IconSun className="h-full w-full" />

    return theme === 'light' ? (
      <IconSun className="h-full w-full" />
    ) : (
      <IconMoon className="h-full w-full" />
    )
  }

  const navItems = [
    ...defaultConfig.navItems.map(item => ({
      href: item.default ? '/' : item.href,
      icon: getIconForPath(item.href),
      title: item.label,
    })),
    {
      href: '#',
      icon: getThemeIcon(),
      onClick: () => mounted && setTheme(theme === 'light' ? 'dark' : 'light'),
      title: 'Toggle Theme',
    },
  ]

  if (!mounted) {
    return (
      <>
        {isHome && (
          <FloatingDock
            bgColor={themeColors.background}
            desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2"
            items={defaultConfig.navItems.map(item => ({
              href: item.default ? '/' : item.href,
              icon: getIconForPath(item.href),
              title: item.label,
            }))}
            mobileClassName="fixed bottom-8 right-8"
            primaryColor={themeColors.primary.DEFAULT}
          />
        )}
      </>
    )
  }

  return (
    <>
      {isHome && (
        <FloatingDock
          bgColor={themeColors.background}
          desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2"
          items={navItems}
          mobileClassName="fixed bottom-8 right-8"
          primaryColor={themeColors.primary.DEFAULT}
        />
      )}
      {!isHome && (
        <AnimatePresence>
          <div className="fixed bottom-8 right-8 md:right-12">
            <div className="flex gap-2">
              <motion.button
                className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium shadow-sm transition-colors hover:bg-primary/10"
                style={{
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.primary.DEFAULT,
                  color: themeColors.primary.DEFAULT,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {getThemeIcon()}
              </motion.button>
              <motion.button
                className="flex h-8 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-sm transition-colors hover:bg-primary/10"
                style={{
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.primary.DEFAULT,
                  color: themeColors.primary.DEFAULT,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.replace('/')}
              >
                <IconArrowBack className="h-4 w-4" />
                <span>Back</span>
              </motion.button>
            </div>
          </div>
        </AnimatePresence>
      )}
    </>
  )
}
