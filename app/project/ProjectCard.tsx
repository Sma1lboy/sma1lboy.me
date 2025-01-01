'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Chip,
  Tooltip,
} from '@nextui-org/react'
import { FaStar, FaCode } from 'react-icons/fa'
import { BiGitRepoForked } from 'react-icons/bi'

import { cn } from '@/lib/utils'

interface ProjectCardProps {
  name: string
  description: string
  url: string
  language: string
  stars: number
  forks: number
  updatedAt: string
  owner: string
  isOrg: boolean
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  url,
  language,
  stars,
  forks,
  updatedAt,
  owner,
  isOrg,
}) => {
  const { theme } = useTheme()

  return (
    <Card
      className={cn(
        'w-full overflow-hidden rounded-lg shadow-lg',
        'transition-all duration-300',
        'hover:shadow-xl',
        'border-border border',
        theme === 'dark'
          ? 'bg-card/30 hover:bg-card/50'
          : 'bg-background/80 hover:bg-background'
      )}
    >
      <CardHeader className="flex flex-col items-start gap-1 px-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <FaCode className="flex-shrink-0 text-lg text-primary" />
            <Tooltip content={name}>
              <h3 className="truncate text-base font-bold text-foreground">
                {name}
              </h3>
            </Tooltip>
          </div>
          <Chip
            className="flex-shrink-0"
            color={isOrg ? 'secondary' : 'primary'}
            size="sm"
            variant="flat"
          >
            {isOrg ? 'Org' : 'Personal'}
          </Chip>
        </div>
        <Link
          isExternal
          className={cn(
            'text-xs',
            'transition-colors duration-200',
            theme === 'dark'
              ? 'text-primary-400 hover:text-primary-300'
              : 'text-primary-600 hover:text-primary-700'
          )}
          href={`https://github.com/${owner}`}
        >
          {owner}
        </Link>
      </CardHeader>
      <Divider className="bg-border" />
      <CardBody>
        <p className="mb-3 line-clamp-2 text-sm text-foreground/90">
          {description || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-2">
          {language && (
            <Chip
              className={cn(theme === 'dark' ? 'bg-muted' : 'bg-background')}
              color="default"
              size="sm"
              variant="flat"
            >
              {language}
            </Chip>
          )}
          <Chip
            color="warning"
            size="sm"
            startContent={<FaStar className="text-warning" />}
            variant="flat"
          >
            {stars}
          </Chip>
          <Chip
            color="success"
            size="sm"
            startContent={<BiGitRepoForked className="text-success" />}
            variant="flat"
          >
            {forks}
          </Chip>
        </div>
      </CardBody>
      <Divider className="bg-border" />
      <CardFooter className="flex items-center justify-between px-4">
        <span className="text-muted-foreground text-xs">
          Updated: {new Date(updatedAt).toLocaleDateString()}
        </span>
        <Link
          isExternal
          showAnchorIcon
          className={cn(
            'text-xs font-medium',
            'transition-colors duration-200',
            theme === 'dark'
              ? 'text-primary-400 hover:text-primary-300'
              : 'text-primary-600 hover:text-primary-700'
          )}
          href={url}
        >
          View on GitHub
        </Link>
      </CardFooter>
    </Card>
  )
}
