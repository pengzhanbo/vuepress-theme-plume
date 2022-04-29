import { fs, path } from '@vuepress/utils'

export interface MarkdownFile {
  filepath: string
  content: string
  createTime: Date
}

export const readFileList = (
  sourceDir: string,
  fileList: MarkdownFile[] = []
): MarkdownFile[] => {
  const files = fs.readdirSync(sourceDir)
  files.forEach((file) => {
    const filepath = path.join(sourceDir, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      if (file !== '.vuepress' && file !== 'node_modules')
        readFileList(filepath, fileList)
    } else {
      const extname = path.extname(file)
      if (extname === '.md' || extname === '.MD') {
        fileList.push(readFile(filepath, stat))
      }
    }
  })
  return fileList
}

export const readFile = (filepath: string, stat: fs.Stats): MarkdownFile => {
  return {
    filepath,
    content: fs.readFileSync(filepath, 'utf-8'),
    createTime: getFileCreateTime(stat),
  }
}

export const getFileCreateTime = (stat: fs.Stats): Date => {
  return stat.birthtime.getFullYear() !== 1970 ? stat.birthtime : stat.atime
}
