'use client'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useRef, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

import { defaultTheme } from '../app/generateTheme'
import { cn } from '../lib/utils'

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const beams = [
    {
      delay: 2,
      duration: 7,
      initialX: 10,
      repeatDelay: 3,
      translateX: 10,
    },
    {
      delay: 4,
      duration: 3,
      initialX: 600,
      repeatDelay: 3,
      translateX: 600,
    },
    {
      className: 'h-6',
      duration: 7,
      initialX: 100,
      repeatDelay: 7,
      translateX: 100,
    },
    {
      delay: 4,
      duration: 5,
      initialX: 400,
      repeatDelay: 14,
      translateX: 400,
    },
    {
      className: 'h-20',
      duration: 11,
      initialX: 800,
      repeatDelay: 2,
      translateX: 800,
    },
    {
      className: 'h-12',
      duration: 4,
      initialX: 1000,
      repeatDelay: 2,
      translateX: 1000,
    },
    {
      className: 'h-6',
      delay: 2,
      duration: 6,
      initialX: 1200,
      repeatDelay: 4,
      translateX: 1200,
    },
  ]

  return (
    <div
      ref={parentRef}
      className={cn(
        'relative flex h-screen w-full items-center justify-center overflow-hidden',
        className
      )}
      style={{
        background: mounted
          ? `linear-gradient(to bottom, ${defaultTheme[theme as 'light' | 'dark'].colors.background}, ${defaultTheme[theme as 'light' | 'dark'].colors.background})`
          : 'transparent',
      }}
    >
      {beams.map(beam => (
        <CollisionMechanism
          key={beam.initialX + 'beam-idx'}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
        style={{
          backgroundColor: mounted
            ? defaultTheme[theme as 'light' | 'dark'].colors.primary.DEFAULT
            : 'transparent',
          boxShadow:
            '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
        }}
      />
    </div>
  )
}

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>
    parentRef: React.RefObject<HTMLDivElement>
    beamOptions?: {
      initialX?: number
      translateX?: number
      initialY?: number
      translateY?: number
      rotate?: number
      className?: string
      duration?: number
      delay?: number
      repeatDelay?: number
    }
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const beamRef = useRef<HTMLDivElement>(null)
  const [collision, setCollision] = useState<{
    detected: boolean
    coordinates: { x: number; y: number } | null
  }>({
    coordinates: null,
    detected: false,
  })
  const [beamKey, setBeamKey] = useState(0)
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        const parentRect = parentRef.current.getBoundingClientRect()

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2
          const relativeY = beamRect.bottom - parentRect.top

          setCollision({
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
            detected: true,
          })
          setCycleCollisionDetected(true)
        }
      }
    }

    const animationInterval = setInterval(checkCollision, 50)

    return () => clearInterval(animationInterval)
  }, [cycleCollisionDetected, containerRef])

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ coordinates: null, detected: false })
        setCycleCollisionDetected(false)
      }, 2000)

      setTimeout(() => {
        setBeamKey(prevKey => prevKey + 1)
      }, 2000)
    }
  }, [collision])

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        className={cn(
          'absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t',
          beamOptions.className
        )}
        initial={{
          rotate: beamOptions.rotate || 0,
          translateX: beamOptions.initialX || '0px',
          translateY: beamOptions.initialY || '-200px',
        }}
        style={{
          backgroundImage: mounted
            ? `linear-gradient(to top, ${defaultTheme[theme as 'light' | 'dark'].colors.primary.DEFAULT} 0%, ${defaultTheme[theme as 'light' | 'dark'].colors.primary.DEFAULT} 50%, transparent 100%)`
            : 'transparent',
        }}
        transition={{
          delay: beamOptions.delay || 0,
          duration: beamOptions.duration || 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: beamOptions.repeatDelay || 0,
          repeatType: 'loop',
        }}
        variants={{
          animate: {
            rotate: beamOptions.rotate || 0,
            translateX: beamOptions.translateX || '0px',
            translateY: beamOptions.translateY || '1800px',
          },
        }}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            theme={theme as 'light' | 'dark'}
          />
        )}
      </AnimatePresence>
    </>
  )
})

CollisionMechanism.displayName = 'CollisionMechanism'

const Explosion = ({
  theme,
  ...props
}: React.HTMLProps<HTMLDivElement> & { theme: 'light' | 'dark' }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
    id: index,
    initialX: 0,
    initialY: 0,
  }))

  return (
    <div {...props} className={cn('absolute z-50 h-2 w-2', props.className)}>
      <motion.div
        animate={{ opacity: 1 }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      {spans.map(span => (
        <motion.span
          key={span.id}
          animate={{
            opacity: 0,
            x: span.directionX,
            y: span.directionY,
          }}
          className="absolute h-1 w-1 rounded-full"
          initial={{ opacity: 1, x: span.initialX, y: span.initialY }}
          style={{
            backgroundColor:
              defaultTheme[theme as 'light' | 'dark'].colors.primary.DEFAULT,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
