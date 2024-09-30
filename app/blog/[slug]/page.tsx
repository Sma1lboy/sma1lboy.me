import { readFile } from 'fs/promises'
import { resolve } from 'path'

import MarkdownNote from '@/components/MarkdownProvider'
import { MarkdownUtils } from '@/utils/MarkdownUtils'

interface BlogPostProps {
  params: {
    slug: string
  }
}
const BLOG_BASE_URL = './public/blog'

export async function generateStaticParams() {
  return MarkdownUtils.getAllMarkdownFilesDetail(BLOG_BASE_URL).map(b => {
    slug: b.slug
  })
}

const BlogPost = async ({ params }: BlogPostProps) => {
  const { slug } = params
  const blogBaseUrl = './public/blog'
  const filePath = resolve(
    blogBaseUrl,
    MarkdownUtils.convertSlugToMarkdownName(slug)
  )

  try {
    const content = await readFile(filePath, 'utf-8')

    return (
      <div className="container mx-auto px-4 py-8">
        <MarkdownNote>{content}</MarkdownNote>
      </div>
    )
  } catch (error) {
    console.error('Error reading blog post:', error)
  }
}

export default BlogPost
