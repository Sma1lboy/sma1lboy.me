/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
'use client'
import React, { useState, useMemo } from 'react'
import { Input } from '@nextui-org/react'
import { SearchIcon, FolderIcon } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

import { Blog } from './type'
import BlogCardList from './BlogCardList'

import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DirectoryTree {
  name: string
  path: string
  blogs: Blog[]
  subdirectories: DirectoryTree[]
}

const FileItem = ({ blog }: { blog: Blog }) => (
  <Link
    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block rounded px-2 py-1 text-sm transition-colors hover:underline"
    href={`/blog/${blog.slug}`}
  >
    {blog.title}
  </Link>
)

export const BlogContent = ({ blogs }: { blogs: Blog[] }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)

  const directoryTree = useMemo(() => {
    const tree: DirectoryTree = {
      blogs: [],
      name: 'root',
      path: '',
      subdirectories: [],
    }

    blogs.forEach(blog => {
      const parts = blog.slug.split('/')
      let currentNode = tree

      if (parts.length === 1) {
        tree.blogs.push(blog)

        return
      }

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        let found = currentNode.subdirectories.find(dir => dir.name === part)

        if (!found) {
          found = {
            blogs: [],
            name: part,
            path: parts.slice(0, i + 1).join('/'),
            subdirectories: [],
          }
          currentNode.subdirectories.push(found)
        }

        currentNode = found
      }

      currentNode.blogs.push(blog)
    })

    return tree
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    return blogs.filter(
      blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.description &&
          blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [blogs, searchQuery])

  const renderDirectory = (node: DirectoryTree) => {
    if (node.name === 'root') {
      return (
        <>
          {/* Render root-level blogs directly */}
          {node.blogs.map(blog => (
            <FileItem key={blog.slug} blog={blog} />
          ))}
          {/* Render subdirectories */}
          {node.subdirectories.map(subdir => (
            <AccordionItem key={subdir.path} value={subdir.path}>
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <FolderIcon size={16} />
                  {subdir.name}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-6 space-y-1">
                  {subdir.blogs.map(blog => (
                    <FileItem key={blog.slug} blog={blog} />
                  ))}
                  {subdir.subdirectories.map(subSubDir =>
                    renderDirectory(subSubDir)
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </>
      )
    }

    return (
      <AccordionItem key={node.path} value={node.path}>
        <AccordionTrigger className="text-sm">
          <div className="flex items-center gap-2">
            <FolderIcon size={16} />
            {node.name}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="ml-6 space-y-1">
            {node.blogs.map(blog => (
              <FileItem key={blog.slug} blog={blog} />
            ))}
            {node.subdirectories.map(subdir => renderDirectory(subdir))}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-7xl gap-6 px-5 py-8"
        exit={{ opacity: 0, y: -20 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* show file button */}
        {!showSidebar && (
          <button
            aria-label="Toggle directory sidebar"
            className="fixed bottom-6 left-4 z-50 rounded-full bg-background p-3 lg:hidden"
            onClick={() => setShowSidebar(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowSidebar(true)
              }
            }}
          >
            <FolderIcon className="text-primary" size={20} />
          </button>
        )}

        <aside
          aria-label="Blog categories"
          className={cn(
            'bg-card fixed left-0 top-0 z-50 h-screen w-64 shrink-0 rounded-lg border bg-background p-4 shadow-sm transition-transform duration-300 lg:static lg:z-0 lg:h-auto lg:translate-x-0',
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={e => e.stopPropagation()}
        >
          <h2 className="mb-4 font-semibold">Categories</h2>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <Accordion className="w-full" type="multiple">
              {renderDirectory(directoryTree)}
            </Accordion>
          </ScrollArea>
        </aside>

        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 lg:hidden',
            showSidebar ? 'block' : 'hidden'
          )}
          onClick={() => setShowSidebar(false)}
        />

        <div className="flex-1">
          <div className="mb-8">
            <Input
              classNames={{
                base: 'max-w-full h-12',
                input: 'text-medium',
                inputWrapper:
                  'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 hover:bg-default-400/30 dark:hover:bg-default-500/30',
                mainWrapper: 'h-full',
              }}
              placeholder="Search blogs..."
              size="md"
              startContent={
                <SearchIcon className="text-default-500" size={20} />
              }
              type="search"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>

          <BlogCardList initialBlogs={filteredBlogs} />

          <div className="mt-8 text-center">
            <a
              className="inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3 hover:text-primary-400"
              href="https://blog.sma1lboy.me"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Go to Full version of blog Web</span>
              <svg
                className="lucide lucide-arrow-right"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
