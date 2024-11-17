import type { Page } from 'vuepress/core'
import type { PageCategoryData, PlumeThemeLocaleOptions, PlumeThemePageData } from '../../shared/index.js'
import { ensureLeadingSlash, isPlainObject } from '@vuepress/helper'
import { resolveNotesLinkList } from '../config/index.js'
import { hash } from '../utils/index.js'

let uuid = 10000
const cache: Record<string, number> = {}

const RE_CATEGORY = /^(?:(\d+)\.)?([\s\S]+)$/
let LOCALE_RE: RegExp

export function autoCategory(
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions,
) {
  const pagePath = page.filePathRelative
  const blog = isPlainObject(options.blog) ? options.blog : {}
  const enabled = blog.categories !== false

  if (page.data.type || !pagePath || !enabled)
    return

  const notesLinks = resolveNotesLinkList(options)
  if (notesLinks.some(link => page.path.startsWith(link)))
    return

  LOCALE_RE ??= new RegExp(
    `^(${Object.keys(options.locales || {}).filter(l => l !== '/').join('|')})`,
  )
  const list = ensureLeadingSlash(pagePath)
    .replace(LOCALE_RE, '')
    .replace(/^\//, '')
    .split('/')
    .slice(0, -1)

  const categoryList: PageCategoryData[] = list
    .map((category, index) => {
      const match = category.match(RE_CATEGORY) || []
      if (!cache[match[2]] && !match[1]) {
        cache[match[2]] = uuid++
      }
      return {
        id: hash(list.slice(0, index + 1).join('-')).slice(0, 6),
        sort: Number(match[1] || cache[match[2]]),
        name: match[2],
      }
    })
  page.data.categoryList = blog.categoriesTransform?.(categoryList) || categoryList
}
