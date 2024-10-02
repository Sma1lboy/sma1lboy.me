/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'

export const CustomThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="cursor-pointer rounded-full p-2 transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-purple-400" />
      )}
    </div>
  )
}
