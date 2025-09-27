import type { App } from 'vuepress'
import type { AutoFrontmatterMarkdownFile } from '../../shared/index.js'
import type { Generate } from './generator.js'
import fg from 'fast-glob'
import { fs, path } from 'vuepress/utils'
import { normalizePath } from '../utils/index.js'

export async function readMarkdownList(
  app: App,
  { globFilter, checkCache }: Generate,
): Promise<AutoFrontmatterMarkdownFile[]> {
  const source = app.dir.source()
  const files: string[] = await fg(['**/*.md'], {
    cwd: source,
    ignore: ['node_modules', '.vuepress'],
  })

  return await Promise.all(
    files
      .filter((id) => {
        if (!globFilter(id))
          return false
        return checkCache(path.join(source, id))
      })
      .map(file => readMarkdown(source, file)),
  )
}

export async function readMarkdown(
  sourceDir: string,
  relativePath: string,
): Promise<AutoFrontmatterMarkdownFile> {
  const filepath = path.join(sourceDir, relativePath)
  const stats = await fs.promises.stat(filepath)
  return {
    filepath,
    relativePath: normalizePath(relativePath),
    content: await fs.promises.readFile(filepath, 'utf-8'),
    createTime: getFileCreateTime(stats),
    stats,
  }
}

export function getFileCreateTime(stats: fs.Stats): Date {
  return stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats.atime
}
