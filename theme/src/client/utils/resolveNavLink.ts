import type { ResolvedNavItemWithLink, ThemeBadge } from '../../shared/index.js'
import {
  ensureEndingSlash,
  ensureLeadingSlash,
  isLinkAbsolute,
  isLinkWithProtocol,
} from '@vuepress/helper/client'
import { resolveRoute } from 'vuepress/client'

/**
 * Resolve NavLink props from string
 * Converts a link string to a resolved navigation item with metadata
 *
 * 从字符串解析 NavLink 属性
 * 将链接字符串转换为带有元数据的解析导航项
 *
 * @param link - The link string to resolve / 要解析的链接字符串
 * @returns Resolved navigation item with link, text, icon and badge / 解析后的导航项，包含链接、文本、图标和徽章
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export function resolveNavLink(link: string): ResolvedNavItemWithLink {
  const { notFound, meta, path } = resolveRoute<{
    title?: string
    icon?: string
    badge?: string | ThemeBadge
  }>(link)

  return notFound
    ? { text: path, link: path }
    : {
        text: meta.title || normalizeTitleWithPath(path),
        link: path,
        icon: meta.icon,
        badge: meta.badge,
      }
}

/**
 * Normalize a path to extract a readable title
 * Removes index.html, .html extension and trailing slash
 *
 * 规范化路径以提取可读的标题
 * 移除 index.html、.html 扩展名和尾部斜杠
 *
 * @param path - The path to normalize / 要规范化的路径
 * @returns The extracted title from path / 从路径提取的标题
 */
function normalizeTitleWithPath(path: string): string {
  path = path.replace(/index\.html?$/i, '').replace(/\.html?$/i, '').replace(/\/$/, '')
  return decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))
}

/**
 * Normalize a link by combining base and link
 * Handles absolute links and protocol links correctly
 *
 * 通过组合 base 和 link 来规范化链接
 * 正确处理绝对链接和协议链接
 *
 * @param base - Base URL / 基础 URL
 * @param link - Link to normalize / 要规范化的链接
 * @returns Normalized link / 规范化后的链接
 */
export function normalizeLink(base = '', link = ''): string {
  return isLinkAbsolute(link) || isLinkWithProtocol(link)
    ? link
    : ensureLeadingSlash(`${base}/${link}`.replace(/\/+/g, '/'))
}

/**
 * Normalize a prefix by ensuring it ends with a slash
 *
 * 规范化前缀，确保它以斜杠结尾
 *
 * @param base - Base URL / 基础 URL
 * @param link - Link to normalize / 要规范化的链接
 * @returns Normalized prefix with trailing slash / 带有尾部斜杠的规范化前缀
 */
export function normalizePrefix(base: string, link = ''): string {
  return ensureEndingSlash(normalizeLink(base, link))
}
