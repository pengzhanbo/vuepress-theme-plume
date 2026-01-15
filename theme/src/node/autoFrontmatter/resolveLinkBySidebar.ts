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
      const { prefix, dir = '', link = '/', items, text = '' } = item
      getSidebarLink(items, link, text, path.join(_prefix, prefix || dir), res)
    }
  }
  return res
}

function getSidebarLink(items: 'auto' | (string | ThemeSidebarItem)[] | undefined, link: string, text: string, dir = '', res: Record<string, string> = {}) {
  if (items === 'auto')
    return

  if (!items) {
    res[ensureEndingSlash(dir)] = link
    return
  }

  for (const item of items) {
    if (typeof item === 'string') {
      res[ensureEndingSlash(dir)] = link
    }
    else {
      const { prefix = '', dir: subDir = '', link: subLink = '/', items: subItems, text: subText = '' } = item
      getSidebarLink(
        subItems,
        path.join(link, subLink),
        subText,
        path.join(prefix[0] === '/' ? prefix : `/${dir}/${prefix || subDir}`),
        res,
      )
    }
  }
}
