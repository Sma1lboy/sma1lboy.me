import { readFileSync } from 'fs'
import path from 'path'

import { Suspense } from 'react'

import { siteConfig } from '@/config/site'
import UserProfile from '@/components/UserProfile'

/*

init config

*/

const des = readFileSync(path.resolve('./config/description.md'), 'utf-8')

siteConfig.description = des

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Suspense fallback={<div>Loading user profile...</div>}>
        <UserProfile username={siteConfig.name} />
      </Suspense>
    </section>
  )
}
