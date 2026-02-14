/**
 * Regular expression to match external URLs
 *
 * 匹配外部 URL 的正则表达式
 */
export const EXTERNAL_URL_RE: RegExp = /^[a-z]+:/i

/**
 * Regular expression to match pathname protocol
 *
 * 匹配 pathname 协议的正则表达式
 */
export const PATHNAME_PROTOCOL_RE: RegExp = /^pathname:\/\//

/**
 * Regular expression to match hash
 *
 * 匹配哈希值的正则表达式
 */
export const HASH_RE: RegExp = /#.*/

/**
 * Regular expression to match file extension
 *
 * 匹配文件扩展名的正则表达式
 */
export const EXT_RE: RegExp = /(index|README)?\.(md|html)$/

/**
 * Whether running in browser
 *
 * 是否在浏览器中运行
 */
export const inBrowser: boolean = typeof document !== 'undefined'

/**
 * Convert value to array
 *
 * 将值转换为数组
 *
 * @param value - Value to convert, can be single value or array / 要转换的值，可以是单个值或数组
 * @returns Array containing the value(s) / 包含值的数组
 */
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

/**
 * Check if the current path matches the given match path
 * Supports both exact matching and regex matching
 *
 * 检查当前路径是否匹配给定的匹配路径
 * 支持精确匹配和正则匹配
 *
 * @param currentPath - Current path to check / 要检查的当前路径
 * @param matchPath - Path pattern to match against / 要匹配的路径模式
 * @param asRegex - Whether to treat matchPath as regex / 是否将 matchPath 视为正则表达式
 * @returns True if paths match / 如果路径匹配则返回 true
 */
export function isActive(
  currentPath: string,
  matchPath?: string,
  asRegex = false,
): boolean {
  if (matchPath === undefined)
    return false

  currentPath = normalize(`/${currentPath.replace(/^\//, '')}`)

  if (asRegex)
    return new RegExp(matchPath).test(currentPath)

  if (normalize(matchPath) !== currentPath)
    return false

  const hashMatch = matchPath.match(HASH_RE)

  if (hashMatch)
    return (inBrowser ? location.hash : '') === hashMatch[0]

  return true
}

/**
 * Normalize a path by removing hash and file extension
 *
 * 通过移除哈希值和文件扩展名来规范化路径
 *
 * @param path - Path to normalize / 要规范化的路径
 * @returns Normalized path / 规范化后的路径
 */
export function normalize(path: string): string {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '')
}

/**
 * Convert a numeric value to CSS unit string
 * Adds 'px' suffix if the value is a plain number
 *
 * 将数值转换为 CSS 单位字符串
 * 如果值是纯数字则添加 'px' 后缀
 *
 * @param value - Value to convert, can be number or string with unit / 要转换的值，可以是数字或带单位的字符串
 * @returns CSS unit string / CSS 单位字符串
 */
export function numToUnit(value?: string | number): string {
  if (typeof value === 'undefined')
    return ''
  if (String(Number(value)) === String(value)) {
    return `${value}px`
  }
  return value as string
}

const gradient: string[] = ['linear-gradient', 'radial-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient', 'conic-gradient']

/**
 * Check if a value is a CSS gradient
 *
 * 检查值是否为 CSS 渐变
 *
 * @param value - Value to check / 要检查的值
 * @returns True if value is a gradient / 如果值是渐变则返回 true
 */
export function isGradient(value: string): boolean {
  return gradient.some(v => value.startsWith(v))
}
