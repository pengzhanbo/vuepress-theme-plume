import type { ThemeSidebarItem } from '../../../shared/index.js'
import { isString } from '@pengzhanbo/utils'
import { ensureEndingSlash } from 'vuepress/shared'
import { path } from 'vuepress/utils'
import { normalizePath } from '../../utils/index.js'

export function resolveLinkBySidebar(
  sidebar: 'auto' | (string | ThemeSidebarItem)[],
  _prefix: string,
): Record<string, string> {
  const res: Record<string, string> = {}

  if (sidebar === 'auto') {
    return res
  }

  for (const item of sidebar) {
    if (!isString(item)) {
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
    if (isString(item)) {
      res[ensureEndingSlash(dir)] = link
    }
    else {
      const { prefix = '', dir: subDir = '', link: subLink = '/', items: subItems } = item
      const subDirectory = prefix[0] === '/'
        ? toDirKey(prefix)
        : path.join(dir, prefix || subDir)
      getSidebarLink(
        subItems,
        path.join(link, subLink),
        subDirectory,
        res,
      )
    }
  }
}

/**
 * Normalize a directory into a single-leading-slash key
 *
 * 将目录规范化为仅带一个前导斜杠的目录键。
 *
 * @param dir - Directory declared in the sidebar / 侧边栏中声明的目录
 * @returns Normalized directory key / 规范化后的目录键
 */
function toDirKey(dir: string): string {
  return `/${normalizePath(dir).replace(/^\/+/, '')}`
}
