import React, { use } from 'react'
import { DocumentTextIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import {
  SiGithub,
  SiLinkedin,
  SiInstagram,
} from '@icons-pack/react-simple-icons'

import { NumberTicker } from './NumberTicker'

import { ExtendedGitHubUserInfo, UserProfileProps } from '@/models/GithubUser'
import { defaultConfig } from '@/config/siteConfig'

async function getGitHubUserInfo(
  username: string
): Promise<ExtendedGitHubUserInfo> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/github-user?username=${username}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch user information')
  }

  return res.json()
}

const UserProfile: React.FC<UserProfileProps> = ({ username }) => {
  const userInfo = use(getGitHubUserInfo(username))

  const socialLinks = [
    { icon: SiGithub, label: 'GitHub', link: defaultConfig.links.github },
    { icon: SiLinkedin, label: 'LinkedIn', link: defaultConfig.links.linkedin },
    {
      icon: 'BilibiliIcon',
      label: 'Bilibili',
      link: defaultConfig.links.bilibili,
    },
    {
      icon: SiInstagram,
      label: 'Instagram',
      link: defaultConfig.links.instagram,
    },
    {
      icon: EnvelopeIcon,
      label: 'Email',
      link: 'mailto:' + defaultConfig.email,
    },
  ].filter(({ link }) => link !== undefined && link.trim() !== '')

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 font-sans">
      <header className="mb-12">
        <h1 className="mb-2 text-4xl font-bold">
          Hi, I&apos;m {userInfo.name} 👋
        </h1>
      </header>

      <section className="mb-12 text-lg leading-relaxed">
        <p className="text-foreground/50">{defaultConfig.description}</p>
      </section>

      {/* <div className="mb-4 flex items-start justify-between">
        <p className="text-xl text-primary/80">@{userInfo.login}</p>
        <section className="flex space-x-4 text-primary/60">
          {userInfo.location && (
            <div className="flex items-center">
              <MapPinIcon className="mr-2 h-5 w-5" />
              <span>{userInfo.location}</span>
            </div>
          )}
          {userInfo.company && (
            <div className="flex items-center">
              <BuildingOfficeIcon className="mr-2 h-5 w-5" />
              <span>{userInfo.company}</span>
            </div>
          )}
        </section>
      </div>

      <div className="flex space-x-4">
        {defaultConfig.email && (
          <a
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href={`mailto:${defaultConfig.email}`}
          >
            <EnvelopeIcon className="mr-2 h-5 w-5" />
            Contact Me
          </a>
        )}
        {defaultConfig.resume && (
          <a
            className="inline-flex items-center rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href={defaultConfig.resume}
            rel="noopener noreferrer"
            target="_blank"
          >
            <DocumentTextIcon className="mr-2 h-5 w-5" />
            Check Resume
          </a>
        )}
      </div> */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">GitHub Contributions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Commits', value: userInfo.totalCommits },
            { label: 'Issues', value: userInfo.userIssuesCount },
            { label: 'Pull Requests', value: userInfo.pullRequestCount },
            { label: 'Repositories', value: userInfo.public_repos },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary">
                <NumberTicker value={stat.value} />+
              </div>
              <div className="text-sm text-foreground/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5 flex justify-center">
        {defaultConfig.resume && (
          <a
            className="inline-flex items-center rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href={defaultConfig.resume}
            rel="noopener noreferrer"
            target="_blank"
          >
            <DocumentTextIcon className="mr-2 h-5 w-5" />
            Resume
          </a>
        )}
      </section>

      {socialLinks.length > 0 && (
        <footer className="flex justify-center space-x-4">
          {socialLinks.map(({ icon: Icon, label, link }) => (
            <a
              key={label}
              aria-label={label}
              className="text-primary/60 transition-colors hover:text-primary"
              href={link}
              rel="noopener noreferrer"
              target="_blank"
            >
              {Icon === 'BilibiliIcon' ? (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
                </svg>
              ) : (
                <Icon className="h-6 w-6" />
              )}
            </a>
          ))}
        </footer>
      )}
    </div>
  )
}

export default UserProfile
