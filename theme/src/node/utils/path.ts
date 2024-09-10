import { ensureEndingSlash, ensureLeadingSlash, isLinkAbsolute, isLinkWithProtocol } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export const resolve = (...args: string[]) => path.resolve(__dirname, '../', ...args)
export const templates = (url: string) => resolve('../templates', url)

const RE_SLASH = /(\\|\/)+/g
export function normalizePath(path: string) {
  return path.replace(RE_SLASH, '/')
}

export function pathJoin(...args: string[]) {
  return normalizePath(path.join(...args))
}

export function normalizeLink(base: string, link = ''): string {
  return isLinkAbsolute(link) || isLinkWithProtocol(link)
    ? link
    : ensureLeadingSlash(normalizePath(`${base}/${link}/`))
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
