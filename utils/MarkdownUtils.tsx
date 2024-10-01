import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

import markdownToTxt from 'markdown-to-txt'
import parseMD from 'parse-md'

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

  private static getGitLastModifiedDate(filePath: string): string {
    try {
      const dateStr = execSync(`git log -1 --format=%cd -- "${filePath}"`, {
        stdio: ['pipe', 'pipe', 'pipe'],
      })
        .toString()
        .trim()

      console.log('Git date string:', dateStr)
      if (dateStr) {
        const date = new Date(dateStr)

        console.log('Parsed and converted date:', date.toISOString())

        return date.toISOString()
      } else {
        return new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error getting git date for ${filePath}:`, error)

      return new Date().toISOString()
    }
  }

  public static getAllMarkdownFilesDetail(dir: string): Blog[] {
    const mdFiles = MarkdownUtils.getAllMarkdownFilesName(dir)

    return mdFiles.map(file => {
      const filePath = resolve(dir, file)
      const data = readFileSync(filePath, 'utf-8')
      const title = file.replace(/\.md$/, '')
      const description = markdownToTxt(
        data.slice(0, MarkdownUtils.PREFIX_MAX_CHARS)
      ).concat('...')
      const slug = MarkdownUtils.convertMarkdownNameToSlug(file)
      const { metadata, content } = parseMD(data)

      const date = new Date(metadata['Date'] ? metadata['Date'] : Date.now())

      return {
        date: date.toISOString(),
        description,
        slug,
        title,
      }
    })
  }
}
