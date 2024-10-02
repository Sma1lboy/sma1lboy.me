// tailwind.config.js
import { nextui } from '@nextui-org/theme'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        card: {
          light: '#FFFFFF',
          dark: '#FFFFFF',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#FFFFFF',
            foreground: '#1F1F1F',
            primary: {
              50: '#F6F3FF',
              100: '#EDE8FF',
              200: '#D4C6FF',
              300: '#B79CFF',
              400: '#9366FF',
              500: '#7C3AED',
              600: '#6D28D9',
              700: '#5B21B6',
              800: '#4C1D95',
              900: '#3D1A78',
              DEFAULT: '#7C3AED',
            },
            secondary: '#FFA500',
            success: '#10B981',
            warning: '#F59E0B',
            danger: '#EF4444',
          },
        },
        dark: {
          colors: {
            background: '#0F0F0F',
            foreground: '#FFFFFF',
            primary: {
              50: '#F6F3FF',
              100: '#EDE8FF',
              200: '#D4C6FF',
              300: '#B79CFF',
              400: '#9366FF',
              500: '#7C3AED',
              600: '#6D28D9',
              700: '#5B21B6',
              800: '#4C1D95',
              900: '#3D1A78',
              DEFAULT: '#9366FF',
            },
            secondary: '#FFB700',
            success: '#34D399',
            warning: '#FBBF24',
            danger: '#F87171',
          },
        },
      },
    }),
    typography(),
  ],
}
