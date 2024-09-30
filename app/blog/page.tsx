import BlogList from './BlogList'

import { MarkdownUtils } from '@/utils/MarkdownUtils'

const BlogPages = async () => {
  const blogs = await MarkdownUtils.getAllMarkdownFilesDetail('./public/blog')

  return <BlogList initialBlogs={blogs} />
}

export default BlogPages
