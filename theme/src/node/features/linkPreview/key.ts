import type { MarkdownLink } from 'vuepress/markdown'
import { inferRoutePath } from 'vuepress/shared'

/**
 * Normalize a route path into a comparable preview key.
 * Kept in sync with `client/utils/link-preview.ts`.
 *
 * 将路由路径标准化为可比较的预览键。与 `client/utils/link-preview.ts` 保持一致。
 *
 * @param pathname - Route path / 路由路径
 */
export function normalizePreviewPath(pathname: string): string {
  let path = pathname

  try {
    // 相对链接的目录部分被 `encodeURI` 处理过，路径则是 `sanitize` 后的结果，
    // 因此键的比对必须先解码。
    path = decodeURI(path)
  }
  catch {
    // 非法百分号编码：保留原值，不做二次处理
    // Invalid percent-encoding: keep the raw value
  }

  path = path.replace(/\/index\.html$/, '/')

  if (!path.startsWith('/'))
    path = `/${path}`

  return path || '/'
}

/**
 * Strip the site base prefix from a pathname.
 *
 * 去除站点 `base` 前缀（`base` 恒以 `/` 结尾，用前缀切片而不是正则）。
 *
 * @param pathname - Absolute pathname / 绝对路径
 * @param base - Site base / 站点 base
 */
export function stripBase(pathname: string, base: string): string {
  if (base !== '/' && pathname.startsWith(base))
    return `/${pathname.slice(base.length)}`

  return pathname
}

/**
 * Resolve the preview key of a markdown link.
 *
 * 解析一条 markdown 内链的预览键。
 *
 * @param link - Link resolved by markdown-it / markdown-it 解析出的内链
 * @param base - Site base / 站点 base
 * @returns Normalized route path, `null` when the link cannot be resolved
 *          归一化后的路由路径，无法解析时为 `null`
 */
export function resolveLinkKey(link: MarkdownLink, base: string): string | null {
  let pathname: string | null = link.absolute

  if (pathname) {
    pathname = stripBase(pathname, base)
  }
  else {
    // 虚拟页面（`filePathRelative` 为 `null`）没有 `absolute`，退化为 `relative`
    pathname = link.relative.startsWith('/') ? link.relative : `/${link.relative}`
  }

  if (!pathname)
    return null

  return normalizePreviewPath(inferRoutePath(pathname))
}
