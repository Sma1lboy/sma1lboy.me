import React, { use } from 'react'
import {
  UserIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

import { ExtendedGitHubUserInfo, UserProfileProps } from '@/models/GithubUser'

async function getGitHubUserInfo(
  username: string
): Promise<ExtendedGitHubUserInfo> {
  const res = await fetch(
    `http://localhost:3000/api/github-user?username=${username}`,
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
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
        <img
          alt={userInfo.name || userInfo.login}
          className="w-32 h-32 rounded-full ring-4 ring-purple-300 shadow-lg transform transition-all duration-300 hover:scale-105"
          src={userInfo.avatar_url}
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {userInfo.name || userInfo.login}
          </h1>
          <p className="text-gray-600 flex items-center justify-center md:justify-start">
            <UserIcon className="w-5 h-5 mr-2 text-purple-500" /> @
            {userInfo.login}
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-8 leading-relaxed text-center md:text-left animate-fade-in">
        I am a Full Stack Developer and also a student at the University of
        Wisconsin-Madison, majoring in Computer Science. I&apos;m an explorer of
        new tech, an avid learner, and a problem-solver at heart. Moreover,
        I&apos;m a passionate programmer on earth. Feel free to connect with me
        for all things tech or just to say hello! Let&apos;s shape the future of
        tech together. 🌟
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center text-gray-600 bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <MapPinIcon className="w-6 h-6 mr-3 text-purple-500" />
          <span>{userInfo.location || 'Not specified'}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <BuildingOfficeIcon className="w-6 h-6 mr-3 text-purple-500" />
          <span>{userInfo.company || 'Not specified'}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          GitHub Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Commits', value: userInfo.totalCommits },
            { label: 'Issues', value: userInfo.userIssuesCount },
            { label: 'Pull Requests', value: userInfo.pullRequestCount },
            { label: 'Repositories', value: userInfo.public_repos },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white p-4 rounded-lg shadow-md text-center transform transition-all duration-300 hover:scale-105 hover:bg-purple-50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {stat.value}+
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <a
          className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
          href={userInfo.html_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg
            aria-hidden="true"
            className="w-6 h-6 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              fillRule="evenodd"
            />
          </svg>
          GitHub Profile
        </a>
        {userInfo.blog && (
          <a
            className="flex items-center justify-center px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300"
            href={userInfo.blog}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GlobeAltIcon className="w-6 h-6 mr-2" />
            Personal Website
          </a>
        )}
      </div>
    </div>
  )
}

export default UserProfile
