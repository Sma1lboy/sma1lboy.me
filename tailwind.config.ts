import type { Config } from 'tailwindcss'

import { nextui } from '@nextui-org/theme'
import typography from '@tailwindcss/typography'

import { generateThemes } from './utils/tailwindThemeGenerator'
import { defaultConfig } from './config/siteConfig'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', 'class'],
  plugins: [
    nextui({
      themes: {
        ...generateThemes([
          { name: 'light', primaryColor: defaultConfig.colors.light },
          { name: 'dark', primaryColor: defaultConfig.colors.dark },
        ]),
      },
    }),
    typography(),
    require('tailwindcss-animate'),
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse var(--duration) ease-out infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
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
      keyframes: {
        pulse: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 var(--pulse-color)',
          },
          '50%': {
            boxShadow: '0 0 0 8px var(--pulse-color)',
          },
        },
      },
    },
  },
}

export default config
