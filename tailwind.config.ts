import type { Config } from 'tailwindcss'

import { nextui } from '@nextui-org/theme'
import typography from '@tailwindcss/typography'

import { generateThemes } from './utils/tailwindThemeGenerator'

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
          { name: 'light', primaryColor: '#7C3AED' },
          { name: 'dark', primaryColor: '#9366FF' },
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
