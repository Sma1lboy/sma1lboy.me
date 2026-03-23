import React from 'react'
import { motion } from 'framer-motion'

interface PaperCardProps {
  text: string
  isPolished: boolean
  preview?: boolean
  rotation?: number
}

export default function PaperCard({ text, isPolished, preview = false, rotation = 0 }: PaperCardProps) {
  if (preview) {
    return (
      <div className="bg-[#fdfbf7] p-4 shadow-sm w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        <div className="w-full h-2 bg-gray-200 mb-2 rounded opacity-50"></div>
        <div className="w-3/4 h-2 bg-gray-200 mb-2 rounded opacity-50"></div>
        <div className="w-5/6 h-2 bg-gray-200 rounded opacity-50"></div>
      </div>
    )
  }

  return (
    <motion.div 
      drag
      dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 50 }}
      className="bg-[#fdfbf7] w-[210mm] h-[300px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] relative overflow-hidden cursor-grab"
      style={{
        boxShadow: '1px 1px 5px rgba(0,0,0,0.1), 5px 5px 20px rgba(0,0,0,0.05)',
        rotate: rotation
      }}
    >
      {/* Paper Texture/Watermark effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
      
      {/* Header/Date (Visual) */}
      <div className="absolute top-8 right-8 text-[#999] font-serif italic text-sm opacity-50 select-none">
        {new Date().toLocaleDateString()}
      </div>

      <div className={`font-mono whitespace-pre-wrap leading-loose text-xl text-[#222] p-12 w-full h-full ${isPolished ? 'font-serif text-[#1a1a1a]' : ''}`}>
        {text || <span className="opacity-20 italic">The blank page awaits...</span>}
      </div>
    </motion.div>
  )
}
