import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import type { MarkdownFile } from '../shared/index.js'

type MarkdownFileList = MarkdownFile[]

export const readMarkdownList = async (
  sourceDir: string,
  filter: (id: string) => boolean
): Promise<MarkdownFileList> => {
  const files: string[] = await fg(['**/*.md'], {
    cwd: sourceDir,
    ignore: ['node_modules/', '.vuepress/'],
  })

  return files
    .filter((file) => filter(file))
    .map((file) => readMarkdown(sourceDir, file))
}

export const readMarkdown = (
  sourceDir: string,
  relativePath: string
): MarkdownFile => {
  const filepath = path.join(sourceDir, relativePath)
  return {
    filepath,
    relativePath,
    content: fs.readFileSync(filepath, 'utf-8'),
    createTime: getFileCreateTime(fs.statSync(filepath)),
  }
}

export const getFileCreateTime = (stat: fs.Stats): Date => {
  return stat.birthtime.getFullYear() !== 1970 ? stat.birthtime : stat.atime
}
