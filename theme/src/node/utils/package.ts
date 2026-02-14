import process from 'node:process'
import { fs, path } from 'vuepress/utils'
import { resolve } from './path.js'

/**
 * Read and parse JSON file asynchronously
 *
 * 异步读取和解析 JSON 文件
 */
export function readJsonFileAsync<T extends Record<string, any> = Record<string, any>>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {}
  return {} as T
}

/**
 * Get root package.json
 *
 * 获取根目录的 package.json
 */
export function getPackage(): Record<string, any> {
  return readJsonFileAsync(path.join(process.cwd(), 'package.json'))
}

/**
 * Get theme package.json
 *
 * 获取主题的 package.json
 */
export function getThemePackage(): Record<string, any> {
  return readJsonFileAsync(resolve('../package.json'))
}
