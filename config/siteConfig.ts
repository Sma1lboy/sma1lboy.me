import { Config } from './types'

export type SiteConfig = typeof defaultConfig

export const defaultConfig: Config = {
  colors: {
    dark: '#9366FF',
    light: '#7C3AED',
  },
  description: 'Initializing...',
  email: 'cchen686@wisc.edu',
  links: {
    bilibili: 'https://space.bilibili.com/72605744',
    github: 'https://github.com/Sma1lboy',
    instagram: 'https://www.instagram.com/sma1lboy/',
    linkedin: 'https://www.linkedin.com/in/chong-chen-857214292/',
  },
  maxNotesPerPage: 3,
  maxProjectsPerPage: 12,
  name: 'Sma1lboy',
  navItems: [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/project',
      label: 'Project',
    },
    {
      href: '/blog',
      label: 'Blog',
    },
  ],
  navMenuItems: [],
  resume: '/resume.pdf',
}
