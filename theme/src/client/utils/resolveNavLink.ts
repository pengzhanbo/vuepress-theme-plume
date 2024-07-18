import { resolveRoute } from 'vuepress/client'
import {
  ensureEndingSlash,
  ensureLeadingSlash,
  isLinkAbsolute,
  isLinkWithProtocol,
} from '@vuepress/helper/client'
import type { ResolvedNavItemWithLink } from '../../shared/index.js'

/**
 * Resolve NavLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export function resolveNavLink(link: string): ResolvedNavItemWithLink {
  const { notFound, meta, path } = resolveRoute<{
    title?: string
    icon?: string
  }>(link)

  return notFound
    ? { text: path, link: path }
    : {
        text: meta.title || path,
        link: path,
        icon: meta.icon,
      }
}

export function normalizeLink(base = '', link = ''): string {
  return isLinkAbsolute(link) || isLinkWithProtocol(link)
    ? link
    : ensureLeadingSlash(`${base}/${link}`.replace(/\/+/g, '/'))
}

export function normalizePrefix(base: string, link = ''): string {
  return ensureEndingSlash(normalizeLink(base, link))
}
