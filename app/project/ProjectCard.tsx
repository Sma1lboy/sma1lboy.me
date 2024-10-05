'use client'
import React from 'react'
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
  return (
    <Card className="w-full overflow-hidden rounded-lg bg-background shadow-lg transition-all duration-1000 hover:shadow-xl">
      <CardHeader className="flex flex-col items-start gap-1 px-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <FaCode className="flex-shrink-0 text-lg text-primary-600" />
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
          className="text-xs text-primary-700 transition-colors duration-200 hover:text-primary-500"
          href={`https://github.com/${owner}`}
        >
          {owner}
        </Link>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="mb-3 line-clamp-2 text-sm text-foreground">
          {description || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-2">
          {language && (
            <Chip color="default" size="sm" variant="flat">
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
      <Divider />
      <CardFooter className="flex items-center justify-between px-4">
        <span className="text-xs text-primary-400">
          Updated: {new Date(updatedAt).toLocaleDateString()}
        </span>
        <Link
          isExternal
          showAnchorIcon
          className="text-xs font-medium text-primary-500 hover:text-primary-600"
          href={url}
        >
          View on GitHub
        </Link>
      </CardFooter>
    </Card>
  )
}
