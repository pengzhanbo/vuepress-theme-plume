import { ensureEndingSlash, ensureLeadingSlash, isLinkAbsolute, isLinkWithProtocol } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

/**
 * Resolve theme directory path
 * Resolves paths relative to the theme's root directory
 *
 * 解析主题目录路径
 * 解析相对于主题根目录的路径
 *
 * @param args - Path segments to resolve / 要解析的路径段
 * @returns Resolved absolute path / 解析后的绝对路径
 */
export const resolve = (...args: string[]): string => path.resolve(__dirname, '../', ...args)

/**
 * Resolve template path
 * Resolves paths relative to the templates directory
 *
 * 解析模板路径
 * 解析相对于模板目录的路径
 *
 * @param url - Template file path / 模板文件路径
 * @returns Resolved template path / 解析后的模板路径
 */
export const templates = (url: string): string => resolve('../templates', url)

const RE_SLASH = /(\\|\/)+/g

/**
 * Normalize path separators
 * Converts backslashes to forward slashes for cross-platform compatibility
 *
 * 规范化路径分隔符
 * 将反斜杠转换为正斜杠以实现跨平台兼容性
 *
 * @param path - Path to normalize / 要规范化的路径
 * @returns Normalized path with forward slashes / 带有正斜杠的规范化路径
 */
export function normalizePath(path: string): string {
  return path.replace(RE_SLASH, '/')
}

/**
 * Join path segments
 * Combines multiple path segments and normalizes the result
 *
 * 连接路径段
 * 组合多个路径段并规范化结果
 *
 * @param args - Path segments to join / 要连接的路径段
 * @returns Joined and normalized path / 连接并规范化的路径
 */
export function pathJoin(...args: string[]): string {
  return normalizePath(path.join(...args))
}

/**
 * Normalize link with base path
 * Combines base path with link, handling absolute and protocol links
 *
 * 规范化带基础路径的链接
 * 将基础路径与链接组合，处理绝对链接和协议链接
 *
 * @param base - Base path / 基础路径
 * @param link - Link to normalize / 要规范化的链接
 * @returns Normalized link / 规范化后的链接
 */
export function normalizeLink(base: string, link = ''): string {
  return isLinkAbsolute(link) || isLinkWithProtocol(link)
    ? link
    : ensureLeadingSlash(normalizePath(`${base}/${link}/`))
}

const RE_START_END_SLASH = /^\/|\/$/g

/**
 * Get current directory name from path
 * Extracts the last segment of a path as the directory name
 *
 * 从路径获取当前目录名
 * 提取路径的最后一段作为目录名
 *
 * @param basePath - Base path to extract from / 要提取的基础路径
 * @param filepath - File path as fallback / 作为后备的文件路径
 * @returns Directory name / 目录名
 */
export function getCurrentDirname(basePath: string | undefined, filepath: string): string {
  const dirList = normalizePath(basePath || path.dirname(filepath))
    .replace(RE_START_END_SLASH, '')
    .split('/')
  return dirList.length > 0 ? dirList[dirList.length - 1] : ''
}

/**
 * Add base path to path
 * Prepends base path to a given path if not already present
 *
 * 为路径添加基础路径
 * 如果给定路径尚未包含基础路径，则在前面添加
 *
 * @param path - Path to modify / 要修改的路径
 * @param base - Base path to prepend / 要添加的基础路径
 * @returns Path with base prepended / 添加了基础路径的路径
 */
export function withBase(path = '', base = '/'): string {
  path = ensureEndingSlash(ensureLeadingSlash(path))
  if (path.startsWith(base))
    return normalizePath(path)
  return normalizePath(`${base}${path}`)
}
