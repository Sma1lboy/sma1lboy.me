import React from 'react'
import PaperCard from './PaperCard'

export default function TypewriterPreview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-32 h-40 transform rotate-[-5deg]">
        <PaperCard text="" isPolished={false} preview={true} />
      </div>
    </div>
  )
}
