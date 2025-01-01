import PulsatingButton from './ui/pulsating-button'

import { defaultTheme } from '@/app/generateTheme'

export const ResumeButton = () => {
  return (
    <a href="/resume.pdf" rel="noopener noreferrer" target="_blank">
      <PulsatingButton
        className="inline-flex flex-row items-center whitespace-nowrap rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        pulseColor={defaultTheme['light'].colors.primary.DEFAULT}
      >
        Resume
      </PulsatingButton>
    </a>
  )
}
