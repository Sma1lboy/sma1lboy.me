import BlogCardList from './BlogCardList'

import { MarkdownUtils } from '@/utils/MarkdownUtils'

const BlogPages = async () => {
  const blogs = await MarkdownUtils.getAllMarkdownFilesDetail('./public/blog')

  return <BlogCardList initialBlogs={blogs} />
}

export default BlogPages
