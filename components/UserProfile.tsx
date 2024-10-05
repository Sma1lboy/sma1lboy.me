import React, { use } from 'react'
import {
  UserIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import {
  SiGithub,
  SiLinkedin,
  SiInstagram,
} from '@icons-pack/react-simple-icons'

import { ExtendedGitHubUserInfo, UserProfileProps } from '@/models/GithubUser'
import { siteConfig } from '@/config/siteConfig'

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

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-background p-8">
      <div className="mb-8 flex flex-col items-center space-y-6 md:flex-row md:space-x-8 md:space-y-0">
        <img
          alt={userInfo.name || userInfo.login}
          className="h-32 w-32 transform rounded-full ring-4 ring-primary-300 transition-all duration-300 hover:scale-105"
          src={userInfo.avatar_url}
        />
        <div className="text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {userInfo.name || userInfo.login}
          </h1>
          <p className="flex items-center justify-center text-foreground/70 md:justify-start">
            <UserIcon className="mr-2 h-5 w-5 text-primary" /> @{userInfo.login}
          </p>
        </div>
      </div>
      <p className="animate-fade-in mb-8 text-center leading-relaxed text-foreground/80 md:text-left">
        {siteConfig.description}
      </p>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center rounded-lg bg-primary-100 p-4 text-foreground/80 dark:bg-primary-900">
          <MapPinIcon className="mr-3 h-6 w-6 text-primary" />
          <span>{userInfo.location || 'Not specified'}</span>
        </div>
        <div className="flex items-center rounded-lg bg-primary-100 p-4 text-foreground/80 dark:bg-primary-900">
          <BuildingOfficeIcon className="mr-3 h-6 w-6 text-primary" />
          <span>{userInfo.company || 'Not specified'}</span>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-center text-2xl font-semibold text-foreground">
          GitHub Stats
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Commits', value: userInfo.totalCommits },
            { label: 'Issues', value: userInfo.userIssuesCount },
            { label: 'Pull Requests', value: userInfo.pullRequestCount },
            { label: 'Repositories', value: userInfo.public_repos },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-lg bg-primary-50 p-4 text-center dark:bg-primary-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-1 text-3xl font-bold text-primary">
                {stat.value}+
              </div>
              <div className="text-sm text-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        {[
          { icon: SiGithub, label: 'GitHub', link: siteConfig.links.github },
          {
            icon: SiLinkedin,
            label: 'LinkedIn',
            link: siteConfig.links.linkedin,
          },
          {
            icon: 'BilibiliIcon',
            label: 'Bilibili',
            link: siteConfig.links.bilibili,
          },
          {
            icon: SiInstagram,
            label: 'Instagram',
            link: siteConfig.links.instagram,
          },
        ].map(({ icon: Icon, label, link }) => (
          <a
            key={label}
            className="flex items-center justify-center text-foreground/70 transition-colors duration-300 hover:text-primary"
            href={link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {Icon === 'BilibiliIcon' ? (
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
              </svg>
            ) : (
              <Icon className="mr-2 h-5 w-5" />
            )}
            <span className="text-sm">{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default UserProfile
