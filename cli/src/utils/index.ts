import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const resolve = (...args: string[]) => path.resolve(__dirname, '../', ...args)

export const getTemplate = (dir: string) => resolve('templates', dir)

export * from './fs.js'
export * from './depsVersion.js'
export * from './getPackageManager.js'
