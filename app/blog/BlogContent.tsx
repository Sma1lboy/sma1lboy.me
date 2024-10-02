'use client'
import { useState } from 'react'
import { Pagination } from '@nextui-org/pagination'

import { Blog } from './Blog'
import BlogCardList from './BlogCardList'

import { siteConfig } from '@/config/site'

export const BlogContent = ({ blogs }: { blogs: Blog[] }) => {
  const [page, setPage] = useState(1)
  const notesPerPage = siteConfig.maxNotesPerPage
  const totalPage = Math.ceil(blogs.length / notesPerPage)

  const filteredBlogs = blogs.slice(
    (page - 1) * notesPerPage,
    page * notesPerPage
  )

  return (
    <div className="mx-auto max-w-3xl">
      <BlogCardList initialBlogs={filteredBlogs} />
      {totalPage !== 1 && (
        <Pagination
          isCompact
          loop
          showControls
          initialPage={page}
          total={totalPage}
          onChange={e => setPage(e)}
        />
      )}
      <div className="mt-4">
        <a
          className="font-serif text-gray-700 hover:text-gray-300"
          href="https://blog.sma1lboy.me"
        >
          Go to Full version of blog Web
        </a>
      </div>
    </div>
  )
}
