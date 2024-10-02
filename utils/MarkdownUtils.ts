import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

import markdownToTxt from 'markdown-to-txt'
import parseMD from 'parse-md'

import { Blog } from '@/app/blog/Blog'

interface BlogMetadata {
  Date?: string
}
export class MarkdownUtils {
  private static readonly BLOG_BASE_URL = './public/blog'
  private static readonly PREFIX_MAX_CHARS = 80

  public static convertMarkdownNameToSlug(name: string): string {
    return name.replace(/\.md$/, '').replace(/\s+/g, '-')
  }

  public static convertSlugToMarkdownName(slug: string): string {
    return `${slug.replace(/-/g, ' ')}.md`
  }

  public static getAllMarkdownFilesName(dir: string): string[] {
    return readdirSync(dir).filter(file => file.endsWith('.md'))
  }

  private static isValidMetadata(metadata: unknown): metadata is BlogMetadata {
    return (
      typeof metadata === 'object' &&
      metadata !== null &&
      'Date' in metadata &&
      (typeof (metadata as BlogMetadata).Date === 'string' ||
        (metadata as BlogMetadata).Date === undefined)
    )
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

      let date: Date

      if (MarkdownUtils.isValidMetadata(metadata) && metadata.Date) {
        date = new Date(metadata.Date)
      } else {
        date = new Date()
      }

      return {
        date: date.toISOString(),
        description,
        filePath,
        slug,
        title,
      }
    })
  }
}
