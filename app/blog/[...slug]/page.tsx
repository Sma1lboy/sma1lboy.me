import { readFile } from 'fs/promises'
import { resolve } from 'path'

import Link from 'next/link'

import MarkdownNote from '@/components/MarkdownProvider'
import { MarkdownUtils } from '@/utils/MarkdownUtils'

interface BlogPostProps {
  params: {
    slug: string[]
  }
}

const BLOG_BASE_URL = './public/blog'

export async function generateStaticParams() {
  const posts = MarkdownUtils.getAllMarkdownFilesDetail(BLOG_BASE_URL)

  return posts.map(post => ({
    slug: encodeURI(post.slug).split('/').filter(Boolean),
  }))
}

const BlogPost = async ({ params }: BlogPostProps) => {
  if (!params.slug || params.slug.length === 0) {
    return <div>Blog Index Page</div>
  }

  const decodedPath = decodeURI(params.slug.join('/'))
  const filePath = resolve(process.cwd(), BLOG_BASE_URL, decodedPath + '.md')

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

    return (
      <div>
        <p>Blog post not found</p>
        <p>Path: {filePath}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }
}

export default BlogPost
