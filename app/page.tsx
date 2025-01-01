import { readFileSync } from 'fs'
import path from 'path'

import { Suspense } from 'react'

//
import { defaultConfig } from '@/config/siteConfig'
import UserProfile from '@/components/UserProfile'
import { BackgroundBeamsWithCollision } from '@/components/background-beams-with-collision'

/*

init config

*/

const des = readFileSync(path.resolve('./config/description.md'), 'utf-8')

defaultConfig.description = des

export default async function Home() {
  return (
    <BackgroundBeamsWithCollision>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Suspense fallback={<div>Loading user profile...</div>}>
          <UserProfile username={defaultConfig.name} />
        </Suspense>
      </section>
    </BackgroundBeamsWithCollision>
  )
}
