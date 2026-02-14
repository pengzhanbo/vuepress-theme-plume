import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname: string = path.dirname(fileURLToPath(import.meta.url))

/**
 * Resolve path relative to the project root
 *
 * 相对于项目根目录解析路径
 *
 * @param args - Path segments to resolve / 要解析的路径段
 * @returns Resolved absolute path / 解析后的绝对路径
 */
export const resolve = (...args: string[]): string => path.resolve(__dirname, '../', ...args)

/**
 * Get template directory path
 *
 * 获取模板目录路径
 *
 * @param dir - Subdirectory name within templates / templates 中的子目录名称
 * @returns Resolved template directory path / 解析后的模板目录路径
 */
export const getTemplate = (dir: string): string => resolve('templates', dir)

export * from './fs.js'
export * from './getPackageManager.js'
