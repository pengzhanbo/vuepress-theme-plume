import type { Page } from 'vuepress/core'
import type { PostsCategoryItem, ThemePageData } from '../../shared/index.js'
import { ensureEndingSlash, ensureLeadingSlash } from '@vuepress/helper'
import { path } from 'vuepress/utils'
import { findCollection } from '../collections/index.js'
import { hash } from '../utils/index.js'

let uuid = 10000
const cache: Record<string, number> = {}

const RE_CATEGORY = /^(?:(\d+)\.)?([\s\S]+)$/

/**
 * Auto category for page
 *
 * 自动为页面生成分类信息，根据文件路径和集合配置自动确定页面所属的分类
 */
export function autoCategory(page: Page<ThemePageData>): void {
  const collection = findCollection(page)

  // 非 post 类型不需要自动分类
  if (collection?.type !== 'post')
    return

  const pagePath = page.filePathRelative

  if (page.data.type || !pagePath || collection.categories === false)
    return

  const collectionDir = ensureEndingSlash(path.join(page.pathLocale, collection.dir))
  const list = ensureLeadingSlash(pagePath)
    .slice(collectionDir.length)
    .split('/')
    .slice(0, -1)
  const categoryList: PostsCategoryItem[] = list
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
  page.data.categoryList = collection.categoriesTransform?.(categoryList) || categoryList
}
