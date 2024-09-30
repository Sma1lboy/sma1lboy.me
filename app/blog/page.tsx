import { readdir, readFile } from 'fs/promises'
import { resolve } from 'path'
import markdownToTxt from 'markdown-to-txt'
import BlogList from './BlogList'

interface Blog {
  title: string
  description: string
  content: string
}

const BlogPages = async () => {
  const blogBaseUrl = './blog.sma1lboy.me'
  const prefixMaxChars = 80
  const blogs: Blog[] = []

  try {
    const files = await readdir(blogBaseUrl)
    const mdFiles = files.filter(f => f.endsWith('.md'))

    for (const file of mdFiles) {
      const filePath = resolve(blogBaseUrl, file)
      const data = await readFile(filePath, 'utf-8')
      const title = file.substring(0, file.length - 3)
      const description = markdownToTxt(
        data.length > prefixMaxChars ? data.substring(0, prefixMaxChars) : data
      )

      blogs.push({
        title,
        description,
        content: data,
      })
    }
  } catch (error) {
    console.error('Error reading blog files:', error)
  }

  return <BlogList initialBlogs={blogs} />
}

export default BlogPages
