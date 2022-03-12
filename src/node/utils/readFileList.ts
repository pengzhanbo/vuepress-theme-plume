import { fs, path } from '@vuepress/utils'

export interface MarkdownFile {
  filePath: string
  content: string
  createTime: Date
}

export function readFileList(
  sourceDir: string,
  fileList: MarkdownFile[] = []
): MarkdownFile[] {
  const files = fs.readdirSync(sourceDir)
  files.forEach((file) => {
    const filePath = path.join(sourceDir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      if (file !== '.vuepress') readFileList(filePath, fileList)
    } else {
      const extname = path.extname(file)
      const basename = path.basename(file).replace(extname, '')
      if (
        (extname === '.md' || extname === '.MD') &&
        basename !== 'README' &&
        basename !== 'readme'
      ) {
        fileList.push({
          filePath,
          content: fs.readFileSync(filePath, 'utf-8'),
          createTime:
            stat.birthtime.getFullYear() !== 1970 ? stat.birthtime : stat.atime,
        })
      }
    }
  })
  return fileList
}
