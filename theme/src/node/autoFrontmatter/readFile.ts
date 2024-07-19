import { fs, path } from 'vuepress/utils'
import fg from 'fast-glob'
import type { AutoFrontmatterMarkdownFile } from '../../shared/index.js'

export async function readMarkdownList(
  sourceDir: string,
  filter: (id: string) => boolean,
): Promise<AutoFrontmatterMarkdownFile[]> {
  const files: string[] = await fg(['**/*.md'], {
    cwd: sourceDir,
    ignore: ['node_modules', '.vuepress'],
  })

  return await Promise.all(
    files
      .filter(filter)
      .map(file => readMarkdown(sourceDir, file)),
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
    relativePath,
    content: await fs.promises.readFile(filepath, 'utf-8'),
    createTime: getFileCreateTime(stats),
    stats,
  }
}

export function getFileCreateTime(stats: fs.Stats): Date {
  return stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats.atime
}
