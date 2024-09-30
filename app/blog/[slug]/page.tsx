import { readFile } from 'fs/promises'
import { resolve } from 'path'

import Link from 'next/link'

import MarkdownNote from '@/components/MarkdownProvider'
import { MarkdownUtils } from '@/utils/MarkdownUtils'

interface BlogPostProps {
  params: {
    slug: string
  }
}

const BLOG_BASE_URL = './public/blog'

export async function generateStaticParams() {
  return MarkdownUtils.getAllMarkdownFilesDetail(BLOG_BASE_URL).map(b => ({
    slug: b.slug,
  }))
}

const BlogPost = async ({ params }: BlogPostProps) => {
  const { slug } = params
  const filePath = resolve(
    BLOG_BASE_URL,
    MarkdownUtils.convertSlugToMarkdownName(slug)
  )

  try {
    const content = await readFile(filePath, 'utf-8')

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            className="mb-4 block font-serif text-gray-600 transition-colors duration-200 hover:text-gray-900"
            href="/blog"
          >
            ← Back to Blog
          </Link>
          <MarkdownNote>{content}</MarkdownNote>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error reading blog post:', error)

    return <div>Blog post not found</div>
  }
}

export default BlogPost
