import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

import markdownToTxt from 'markdown-to-txt'

import { Blog } from '@/app/blog/Blog'

export class MarkdownUtils {
  private static readonly BLOG_BASE_URL = './public/blog'
  private static readonly PREFIX_MAX_CHARS = 80

  public static convertMarkdownNameToSlug(name: string): string {
    return name.replace(/\.md$/, '').replace(/\s+/g, '-').toLowerCase()
  }

  public static convertSlugToMarkdownName(slug: string): string {
    return `${slug.replace(/-/g, ' ')}.md`
  }

  public static getAllMarkdownFilesName(dir: string): string[] {
    return readdirSync(dir).filter(file => file.endsWith('.md'))
  }

  public static getAllMarkdownFilesDetail(dir: string): Blog[] {
    const mdFiles = MarkdownUtils.getAllMarkdownFilesName(dir)

    return mdFiles.map(file => {
      const filePath = resolve(dir, file)
      const data = readFileSync(filePath, 'utf-8')
      const title = file.replace(/\.md$/, '')
      const description = markdownToTxt(
        data.slice(0, MarkdownUtils.PREFIX_MAX_CHARS)
      )
      const slug = MarkdownUtils.convertMarkdownNameToSlug(file)

      return { description, slug, title }
    })
  }
}
