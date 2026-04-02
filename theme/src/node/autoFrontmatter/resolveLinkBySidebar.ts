import type { ThemeSidebarItem } from '../../shared/index.js'
import { ensureEndingSlash } from 'vuepress/shared'
import { path } from 'vuepress/utils'

export function resolveLinkBySidebar(
  sidebar: 'auto' | (string | ThemeSidebarItem)[],
  _prefix: string,
): Record<string, string> {
  const res: Record<string, string> = {}

  if (sidebar === 'auto') {
    return res
  }

  for (const item of sidebar) {
    if (typeof item !== 'string') {
      const { prefix, dir = '', link = '/', items } = item
      getSidebarLink(items, link, path.join(_prefix, prefix || dir), res)
    }
  }
  return res
}

function getSidebarLink(items: 'auto' | (string | ThemeSidebarItem)[] | undefined, link: string, dir = '', res: Record<string, string> = {}) {
  if (items === 'auto' || !items)
    return

  for (const item of items) {
    if (typeof item === 'string') {
      res[ensureEndingSlash(dir)] = link
    }
    else {
      const { prefix = '', dir: subDir = '', link: subLink = '/', items: subItems } = item
      getSidebarLink(
        subItems,
        path.join(link, subLink),
        path.join(prefix[0] === '/' ? prefix : `/${dir}/${prefix || subDir}`),
        res,
      )
    }
  }
}
