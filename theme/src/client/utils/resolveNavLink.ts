import { resolveRoute } from 'vuepress/client'
import type { NavItemWithLink } from '../../shared/index.js'

/**
 * Resolve NavLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export function resolveNavLink(link: string): NavItemWithLink {
  const { notFound, meta, path } = resolveRoute<{
    title?: string
  }>(link)

  return notFound
    ? { text: path, link: path }
    : {
        text: meta.title || path,
        link: path,
      }
}
