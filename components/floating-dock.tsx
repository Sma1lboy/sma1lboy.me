import { IconLayoutNavbarCollapse } from '@tabler/icons-react'
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface DockItem {
  title: string
  icon: React.ReactNode
  href: string
  onClick?: () => void
}

interface DockProps {
  items: DockItem[]
  className?: string
  bgColor: string
  primaryColor: string
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  bgColor,
  primaryColor,
}: {
  items: DockItem[]
  desktopClassName?: string
  mobileClassName?: string
  bgColor: string
  primaryColor: string
}) => {
  return (
    <>
      <FloatingDockDesktop
        bgColor={bgColor}
        className={desktopClassName}
        items={items}
        primaryColor={primaryColor}
      />
      <FloatingDockMobile
        bgColor={bgColor}
        className={mobileClassName}
        items={items}
        primaryColor={primaryColor}
      />
    </>
  )
}

const FloatingDockMobile = ({
  items,
  className,
  bgColor,
  primaryColor,
}: DockProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
            layoutId="nav"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  transition: { delay: idx * 0.05 },
                  y: 10,
                }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                {item.onClick ? (
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: bgColor,
                      color: primaryColor,
                    }}
                    onClick={() => {
                      item.onClick?.()
                      setOpen(false)
                    }}
                  >
                    <div className="h-3.5 w-3.5">{item.icon}</div>
                  </button>
                ) : (
                  <Link
                    key={item.title}
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    href={item.href}
                    style={{
                      backgroundColor: bgColor,
                      color: primaryColor,
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-3.5 w-3.5">{item.icon}</div>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: bgColor,
          color: primaryColor,
        }}
        onClick={() => setOpen(!open)}
      >
        <IconLayoutNavbarCollapse className="h-4 w-4" />
      </button>
    </div>
  )
}

const FloatingDockDesktop = ({
  items,
  className,
  bgColor,
  primaryColor,
}: DockProps) => {
  let mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      className={cn(
        'mx-auto hidden h-12 items-end gap-3 rounded-2xl px-3 pb-2 md:flex',
        className
      )}
      style={{
        backgroundColor: bgColor,
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      onMouseMove={e => mouseX.set(e.pageX)}
    >
      {items.map(item => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          {...item}
          bgColor={bgColor}
          primaryColor={primaryColor}
        />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  bgColor,
  primaryColor,
}: {
  mouseX: MotionValue
  title: string
  icon: React.ReactNode
  href: string
  onClick?: () => void
  bgColor: string
  primaryColor: string
}) {
  let ref = useRef<HTMLButtonElement | HTMLDivElement>(null)

  let distance = useTransform(mouseX, val => {
    let bounds = ref.current?.getBoundingClientRect() ?? { width: 0, x: 0 }

    return val - bounds.x - bounds.width / 2
  })

  let widthTransform = useTransform(distance, [-100, 0, 100], [32, 64, 32])
  let heightTransform = useTransform(distance, [-100, 0, 100], [32, 64, 32])
  let widthTransformIcon = useTransform(distance, [-100, 0, 100], [16, 32, 16])
  let heightTransformIcon = useTransform(distance, [-100, 0, 100], [16, 32, 16])

  let width = useSpring(widthTransform, {
    damping: 12,
    mass: 0.1,
    stiffness: 150,
  })
  let height = useSpring(heightTransform, {
    damping: 12,
    mass: 0.1,
    stiffness: 150,
  })

  let widthIcon = useSpring(widthTransformIcon, {
    damping: 12,
    mass: 0.1,
    stiffness: 150,
  })
  let heightIcon = useSpring(heightTransformIcon, {
    damping: 12,
    mass: 0.1,
    stiffness: 150,
  })

  const [hovered, setHovered] = useState(false)

  const buttonContent = (
    <>
      <AnimatePresence>
        {hovered && (
          <motion.div
            animate={{ opacity: 1, x: '-50%', y: 0 }}
            className="absolute -top-7 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md px-2 py-0.5 text-xs"
            exit={{ opacity: 0, x: '-50%', y: 2 }}
            initial={{ opacity: 0, x: '-50%', y: 10 }}
            style={{
              backgroundColor: bgColor,
              borderColor: primaryColor,
              color: primaryColor,
            }}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex items-center justify-center"
        style={{
          color: primaryColor,
          height: heightIcon,
          width: widthIcon,
        }}
      >
        {icon}
      </motion.div>
    </>
  )

  if (onClick) {
    return (
      <motion.button
        ref={ref as React.RefObject<HTMLButtonElement>}
        className="relative flex aspect-square items-center justify-center rounded-full"
        style={{
          backgroundColor: `${primaryColor}20`,
          color: primaryColor,
          height,
          width,
        }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <Link href={href}>
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative flex aspect-square items-center justify-center rounded-full"
        style={{
          backgroundColor: `${primaryColor}20`,
          color: primaryColor,
          height,
          width,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {buttonContent}
      </motion.div>
    </Link>
  )
}
