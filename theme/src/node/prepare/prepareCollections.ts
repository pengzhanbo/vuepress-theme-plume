import type { App } from 'vuepress'
import type { ThemeCollectionItem } from '../../shared/index.js'
import { omit } from '@pengzhanbo/utils'
import { getThemeConfig } from '../loadConfig/index.js'
import { perf, resolveContent, writeTemp } from '../utils/index.js'

/**
 * Prepare collections data
 *
 * 准备集合数据，为每个语言环境处理集合配置并生成临时文件
 */
export async function prepareCollections(app: App): Promise<void> {
  perf.mark('prepare:collections')

  const { collections: fallback, locales } = getThemeConfig()

  let data: Record<string, ThemeCollectionItem[]> = {}

  for (const [locale, opt] of Object.entries(locales || {})) {
    let collections = opt.collections
    if (locale === '/' && !collections?.length)
      collections = fallback

    if (!collections?.length)
      continue

    data[locale] = collections?.map((item) => {
      if (item.type === 'post') {
        return omit(item, ['include', 'exclude', 'autoFrontmatter'])
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
