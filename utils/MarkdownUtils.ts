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
    return readdirSync(dir).filter(
      file => file.endsWith('.md') && !file.toLowerCase().endsWith('readme.md')
    )
  }

  private static isValidMetadata(metadata: unknown): metadata is BlogMetadata {
    if (typeof metadata !== 'object' || metadata === null) {
      return false
    }

    if (Object.keys(metadata).length === 0) {
      return false
    }

    return 'Date' in metadata
  }

  private static getGitLastModifiedDate(filePath: string): string {
    try {
      const dateStr = execSync(`git log -1 --format=%cd -- "${filePath}"`, {
        stdio: ['pipe', 'pipe', 'pipe'],
      })
        .toString()
        .trim()

      if (dateStr) {
        const date = new Date(dateStr)

        return date.toISOString()
      }

      return new Date().toISOString()
    } catch (error) {
      return new Date().toISOString()
    }
  }

  public static getAllMarkdownFilesDetail(dir: string): Blog[] {
    const mdFiles = MarkdownUtils.getAllMarkdownFilesName(dir)

    return mdFiles.map(file => {
      const filePath = resolve(dir, file)
      const data = readFileSync(filePath, 'utf-8')
      const title = file.replace(/\.md$/, '')

      const slug = MarkdownUtils.convertMarkdownNameToSlug(file)
      const { metadata, content } = parseMD(data)
      const description = markdownToTxt(
        content.slice(0, MarkdownUtils.PREFIX_MAX_CHARS)
      ).concat('...')
      let date: Date

      if (MarkdownUtils.isValidMetadata(metadata) && metadata.Date) {
        const parsedDate = new Date(metadata.Date)

        date = isNaN(parsedDate.getTime())
          ? new Date(MarkdownUtils.getGitLastModifiedDate(filePath))
          : parsedDate
      } else {
        date = new Date(MarkdownUtils.getGitLastModifiedDate(filePath))
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
