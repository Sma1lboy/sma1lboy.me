import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Press_Start_2P as FontPixel,
} from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const fontPixel = FontPixel({
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: '400',
})
