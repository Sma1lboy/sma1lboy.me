import { readFile } from 'fs/promises'
import { join } from 'path'

import Link from 'next/link'

import { MarkdownUtils } from '@/utils/MarkdownUtils'
import MarkdownNote from '@/components/MarkdownProvider'

interface BlogPostProps {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const posts = MarkdownUtils.getAllMarkdownFilesDetail(
    join(process.cwd(), 'public', 'blog')
  )

  return posts.map(post => ({
    // Split the slug into path segments without encoding
    slug: post.slug.split('/').filter(Boolean),
  }))
}

const BlogPost = async ({ params }: BlogPostProps) => {
  if (!params.slug || params.slug.length === 0) {
    return <div>Blog Index Page</div>
  }

  // Handle path segments and construct file path
  const decodedPath = params.slug.map(segment => {
    // Handle potential double-encoded segments
    try {
      return decodeURIComponent(decodeURIComponent(segment))
    } catch {
      return decodeURIComponent(segment)
    }
  })

  // Join path segments and add .md extension
  const filePath = join(process.cwd(), 'public', 'blog', ...decodedPath) + '.md'

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
