import fs from 'fs'
import path from 'path'

const tplRE = /\.tpl$/
const readFileList = (dir: string, fileList = {}): Record<string, string> => {
  const files = fs.readdirSync(dir)
  files.forEach((file: string) => {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      readFileList(filepath, fileList)
    } else {
      const extname = path.extname(filepath)
      if (tplRE.test(extname)) {
        fileList[filepath.replace(tplRE, '')] = fs.readFileSync(filepath, 'utf-8')
      }
    }
  })
  return fileList
}

interface TemplateItem {
  file: string
  content: string
}

export type TemplateList = TemplateItem[]

export const readTemplateList = (dir: string): TemplateList => {
  const templateMap= readFileList(dir)
  const result: TemplateList = []
  Object.keys(templateMap).forEach((key: string) => {
    const file = path.relative(dir, key)
    result.push({
      file,
      content: templateMap[key]
    })
  })
  return result
}
