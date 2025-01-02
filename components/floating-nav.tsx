'use client'
import { usePathname, useRouter } from 'next/navigation'
import { IconHome, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaCameraRetro } from 'react-icons/fa'
import { MdArticle } from 'react-icons/md'
import { FaCode } from 'react-icons/fa'
import { FaHome } from 'react-icons/fa'
import { FaSun, FaMoon } from 'react-icons/fa'

import { FloatingDock } from './floating-dock'

import { defaultConfig } from '@/config/siteConfig'
import { defaultTheme } from '@/app/generateTheme'

const getIconForPath = (href: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    '/blog': <MdArticle className="h-full w-full" />,
    '/home': <FaHome className="h-full w-full" />,
    '/photo': <FaCameraRetro className="h-full w-full" />,
    '/project': <FaCode className="h-full w-full" />,
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
      <FaSun className="h-full w-full" />
    ) : (
      <FaMoon className="h-full w-full" />
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
      <FloatingDock
        bgColor={themeColors.background}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2"
        items={navItems}
        mobileClassName="fixed bottom-8 right-8"
        primaryColor={themeColors.primary.DEFAULT}
      />
    </>
  )
}
