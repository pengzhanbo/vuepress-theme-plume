import type { App } from 'vuepress'
import type { ThemeCollectionItem, ThemeOptions } from '../../shared/index.js'
import { omit } from '@pengzhanbo/utils'
import { entries } from '@vuepress/helper'
import { getThemeConfig } from '../loadConfig/index.js'
import { perf, resolveContent, writeTemp } from '../utils/index.js'

/**
 * Prepare collections data
 *
 * 准备集合数据，为每个语言环境处理集合配置并生成临时文件
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeConfig()` / 主题配置，默认从 `getThemeConfig()` 读取
 */
export async function prepareCollections(app: App, options: ThemeOptions = getThemeConfig()): Promise<void> {
  perf.mark('prepare:collections')

  const { collections: fallback, locales } = options

  let data: Record<string, ThemeCollectionItem[]> = {}

  for (const [locale, opt] of entries(locales || {})) {
    let collections = opt.collections
    if (locale === '/' && !collections?.length)
      collections = fallback

    if (!collections?.length)
      continue

    data[locale] = collections?.map((item) => {
      if (item.type === 'post') {
        return omit(item, ['include', 'exclude', 'autoFrontmatter', 'categoriesTransform'])
      }
      else {
        return omit(item, ['sidebar', 'autoFrontmatter'])
      }
    })
  }

  const content = resolveContent(app, { name: 'collections', content: data })
  await writeTemp(app, 'internal/collectionsData.js', content)

  if (app.env.isBuild) {
    data = {}
  }

  perf.log('prepare:collections')
}
