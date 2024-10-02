import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import clsx from 'clsx'

import { Providers } from './providers'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/config/fonts'
import { NavbarComp } from '@/components/navbar'

export const metadata: Metadata = {
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
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
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className="relative flex h-screen flex-col">
            <NavbarComp />
            <main className="container mx-auto max-w-7xl flex-grow px-6 pt-2">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
