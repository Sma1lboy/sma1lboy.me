'use client'

import { type FC } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface PhotoPageProps {
  photoPaths: string[]
}

export const PhotoGallery: FC<PhotoPageProps> = ({ photoPaths }) => {
  return (
    <div className="min-h-screen w-full p-1">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photoPaths.map(src => (
          <motion.div
            key={src}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative h-auto overflow-hidden shadow-lg"
              style={{
                aspectRatio: '1 / 1.67',
                margin: '0 auto',
                maxWidth: '600px',
                minWidth: '200px',
              }}
            >
              <Image
                fill
                alt=""
                className="object-cover"
                draggable={false}
                priority={false}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={src}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
