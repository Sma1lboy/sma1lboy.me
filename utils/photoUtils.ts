import { readdir } from 'fs/promises'
import { resolve } from 'path'

const IMAGE_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png'] as const

export class PhotoUtils {
  static async getAllPhotoPaths(dir: string): Promise<string[]> {
    try {
      const photoDir = resolve(process.cwd(), dir)
      const files = await readdir(photoDir)

      return files
        .filter(file =>
          IMAGE_EXTENSIONS.includes(
            file
              .substring(file.lastIndexOf('.'))
              .toLowerCase() as (typeof IMAGE_EXTENSIONS)[number]
          )
        )
        .map(file => `/${dir.replace('./public/', '')}/${file}`)
    } catch (error) {
      console.error('Error reading photo directory:', error)

      return []
    }
  }
}
