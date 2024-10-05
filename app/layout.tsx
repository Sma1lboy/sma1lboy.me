import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import clsx from 'clsx'

import { Providers } from './providers'

import { defaultConfig } from '@/config/siteConfig'
import { fontSans } from '@/config/fonts'
import { NavbarComp } from '@/components/navbar'

export const metadata: Metadata = {
  description: defaultConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
  title: {
    default: defaultConfig.name,
    template: `%s - ${defaultConfig.name}`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <NavbarComp />
          {children}
        </Providers>
      </body>
    </html>
  )
}
