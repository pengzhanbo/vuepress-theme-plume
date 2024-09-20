import type { SidebarItem } from '../../shared/index.js'
import { pathJoin } from '../utils/index.js'

export function resolveLinkBySidebar(
  sidebar: 'auto' | (string | SidebarItem)[],
  _prefix: string,
) {
  const res: Record<string, string> = {}

  if (sidebar === 'auto') {
    return res
  }

  for (const item of sidebar) {
    if (typeof item !== 'string') {
      const { prefix, dir = '', link = '/', items, text = '' } = item
      getSidebarLink(items, link, text, pathJoin(_prefix, prefix || dir), res)
    }
  }
  return res
}

function getSidebarLink(items: 'auto' | (string | SidebarItem)[] | undefined, link: string, text: string, dir = '', res: Record<string, string> = {}) {
  if (items === 'auto')
    return

  if (!items) {
    res[pathJoin(dir, `${text}.md`)] = link
    return
  }

  for (const item of items) {
    if (typeof item === 'string') {
      if (!link)
        continue
      if (item) {
        res[pathJoin(dir, `${item}.md`)] = link
      }
      else {
        res[pathJoin(dir, 'README.md')] = link
        res[pathJoin(dir, 'index.md')] = link
        res[pathJoin(dir, 'readme.md')] = link
      }
      res[dir] = link
    }
    else {
      const { prefix, dir: subDir = '', link: subLink = '/', items: subItems, text: subText = '' } = item
      getSidebarLink(subItems, pathJoin(link, subLink), subText, pathJoin(prefix || dir, subDir), res)
    }
  }
}
