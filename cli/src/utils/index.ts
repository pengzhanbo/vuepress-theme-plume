import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname: string = path.dirname(fileURLToPath(import.meta.url))

export const resolve = (...args: string[]): string => path.resolve(__dirname, '../', ...args)

export const getTemplate = (dir: string): string => resolve('templates', dir)

export * from './fs.js'
export * from './getPackageManager.js'
