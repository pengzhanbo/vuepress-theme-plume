import process from 'node:process'
import { fs, path } from 'vuepress/utils'
import { resolve } from './path.js'

export function readJsonFileAsync<T extends Record<string, any> = Record<string, any>>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {}
  return {} as T
}

export function getPackage() {
  return readJsonFileAsync(path.join(process.cwd(), 'package.json'))
}

export function getThemePackage() {
  return readJsonFileAsync(resolve('.../../package.json'))
}
