import { BlogContent } from './BlogContent'

import { MarkdownUtils } from '@/utils/markdownUtils'

const BlogPages = async () => {
  const blogs = await MarkdownUtils.getAllMarkdownFilesDetail('./public/blog')

  return <BlogContent blogs={blogs} />
}

export default BlogPages
