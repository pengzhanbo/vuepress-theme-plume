import { fs, globby, path } from '@vuepress/utils'
import type { MarkdownFile } from '../shared/index.js'

type MarkdownFileList = MarkdownFile[]

export const readMarkdownList = async (
  sourceDir: string,
  glob: string[]
): Promise<MarkdownFileList> => {
  const files: string[] = await globby(glob, {
    cwd: sourceDir,
    gitignore: true,
  })

  return files.map((file) => readMarkdown(sourceDir, file))
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
