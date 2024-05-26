import process from 'node:process'
import { customAlphabet } from 'nanoid'
import { fs, getDirname, path } from 'vuepress/utils'
import { Logger, ensureEndingSlash, ensureLeadingSlash } from '@vuepress/helper'

export const THEME_NAME = 'vuepress-theme-plume'

const __dirname = getDirname(import.meta.url)

export const resolve = (...args: string[]) => path.resolve(__dirname, '../', ...args)
export const templates = (url: string) => resolve('../templates', url)

export const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

export const logger = new Logger(THEME_NAME)

export function getPackage() {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    pkg = JSON.parse(content)
  }
  catch { }
  return pkg
}

export function getThemePackage() {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(resolve('../package.json'), 'utf-8')
    pkg = JSON.parse(content)
  }
  catch {}
  return pkg
}

const RE_SLASH = /(\\|\/)+/g
export function normalizePath(path: string) {
  return path.replace(RE_SLASH, '/')
}

export function pathJoin(...args: string[]) {
  return normalizePath(path.join(...args))
}

const RE_START_END_SLASH = /^\/|\/$/g
export function getCurrentDirname(basePath: string | undefined, filepath: string) {
  const dirList = normalizePath(basePath || path.dirname(filepath))
    .replace(RE_START_END_SLASH, '')
    .split('/')
  return dirList.length > 0 ? dirList[dirList.length - 1] : ''
}

export function withBase(path = '', base = '/'): string {
  path = ensureEndingSlash(ensureLeadingSlash(path))
  if (path.startsWith(base))
    return normalizePath(path)
  return normalizePath(`${base}${path}`)
}
