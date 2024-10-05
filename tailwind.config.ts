import type { Config } from 'tailwindcss'

import { nextui } from '@nextui-org/theme'
import typography from '@tailwindcss/typography'

import { generateThemes } from './utils/tailwindThemeGenerator'
import { siteConfig } from './config/siteConfig'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        ...generateThemes([
          { name: 'light', primaryColor: siteConfig.colors.light },
          { name: 'dark', primaryColor: siteConfig.colors.dark },
        ]),
      },
    }),
    typography(),
  ],
  theme: {
    extend: {
      colors: {
        card: {
          dark: '#FFFFFF',
          light: '#FFFFFF',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)'],
        sans: ['var(--font-sans)'],
      },
    },
  },
}

export default config
