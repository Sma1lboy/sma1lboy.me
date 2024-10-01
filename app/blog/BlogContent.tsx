'use client'
import { useState } from 'react'
import { Pagination } from '@nextui-org/pagination'

import { Blog } from './Blog'
import BlogCardList from './BlogCardList'

export const BlogContent = ({ blogs }: { blogs: Blog[] }) => {
  const [page, setPage] = useState(1)
  const notesPerPage = 2
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
