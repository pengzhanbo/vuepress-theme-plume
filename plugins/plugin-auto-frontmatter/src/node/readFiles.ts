import { fs, path } from '@vuepress/utils'
import fg from 'fast-glob'
import type { MarkdownFile } from '../shared/index.js'

type MarkdownFileList = MarkdownFile[]

export async function readMarkdownList(sourceDir: string, filter: (id: string) => boolean): Promise<MarkdownFileList> {
  const files: string[] = await fg(['**/*.md'], {
    cwd: sourceDir,
    ignore: ['node_modules', '.vuepress'],
  })

  return files
    .filter(file => filter(file))
    .map(file => readMarkdown(sourceDir, file))
}

export function readMarkdown(sourceDir: string, relativePath: string): MarkdownFile {
  const filepath = path.join(sourceDir, relativePath)
  const stats = fs.statSync(filepath)
  return {
    filepath,
    relativePath,
    content: fs.readFileSync(filepath, 'utf-8'),
    createTime: getFileCreateTime(stats),
    stats,
  }
}

export function getFileCreateTime(stats: fs.Stats): Date {
  return stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats.atime
}
