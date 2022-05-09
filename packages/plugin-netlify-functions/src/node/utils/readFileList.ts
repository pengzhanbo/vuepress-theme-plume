import { fs, path } from '@vuepress/utils'

export const readFileList = (
  source: string,
  fileList: string[] = []
): string[] => {
  const files = fs.readdirSync(source)
  files.forEach((file: string) => {
    const filepath = path.join(source, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      if (file !== 'node_modules') {
        readFileList(filepath, fileList)
      }
    } else {
      fileList.push(filepath)
    }
  })
  return fileList
}
