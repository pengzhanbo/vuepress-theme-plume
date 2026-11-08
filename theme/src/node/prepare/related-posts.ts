import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemePageData, ThemeRelatedPostItem } from '../../shared/index.js'
import type { RelatedPostsDoc, RelatedPostsGroup } from '../features/relatedPosts/index.js'
import { collectRelatedPostsGroups } from '../features/relatedPosts/collect.js'
import { applyManualRelatedPosts, resolveGroupRelatedPosts } from '../features/relatedPosts/index.js'
import { getThemeOptions } from '../options.js'
import { hash, logger, perf } from '../utils/index.js'

/**
 * Max number of pages printed in debug mode.
 *
 * debug 模式下最多打印的页面数量。
 */
const DEBUG_SAMPLE_SIZE = 20

interface CacheEntry {
  sig: string
  items: Map<string, ThemeRelatedPostItem[]>
  debug: string[]
}

/**
 * Group level cache. Keyed by group key (`locale::dir` or `locale::type`) and validated
 * by a content signature, so an unchanged group can skip tokenization and scoring
 * entirely, while any edit to the options or the page content invalidates it.
 *
 * 分组级缓存。以分组键（`locale::dir` 或 `locale::type`）索引，并用内容签名做校验：
 * 内容未变的分组完全跳过分词与打分，配置或页面内容变化则自动失效。
 */
const groupCache = new Map<string, CacheEntry>()

/**
 * Signature of one page. The body is included so that editing a page always invalidates
 * the group, no matter whether its length changes.
 *
 * 单页签名。包含正文，因此任何正文改动都会使分组缓存失效，与长度是否变化无关。
 */
function pageSignature(doc: RelatedPostsDoc): string {
  return hash(
    `${doc.path}\n${doc.title}\n${doc.tags.join(',')}\n${doc.createTime}\n${doc.excerpt ?? ''}\n${doc.page.content}`,
  )
}

function groupSignature(group: RelatedPostsGroup): string {
  return hash(`${JSON.stringify(group.options)}\n${group.docs.map(pageSignature).join('\n')}`)
}

function mergeItems(target: Map<string, ThemeRelatedPostItem[]>, source: Map<string, ThemeRelatedPostItem[]>): void {
  for (const [path, items] of source)
    target.set(path, items)
}

/**
 * Prepare related posts data
 *
 * 准备相关文章数据：在集合内部计算相似度，并把结果写入页面数据。
 *
 * The result is written into `page.data.relatedPosts`, which the bundler serializes
 * into the page chunk afterwards, so it is available during SSR.
 *
 * 结果写入 `page.data.relatedPosts`，之后由 bundler 序列化进页面 chunk，SSR 时即可使用。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareRelatedPosts(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:related-posts')

  const pages = app.pages as Page<ThemePageData>[]
  const pageByPath = new Map<string, Page<ThemePageData>>()

  for (const page of pages) {
    pageByPath.set(page.path, page)
    // 每轮先清理，避免关闭功能后遗留旧数据
    if ('relatedPosts' in page.data)
      delete page.data.relatedPosts
  }

  const groups = collectRelatedPostsGroups(pages, options)
  const items = new Map<string, ThemeRelatedPostItem[]>()
  const debug: string[] = []

  if (groups.length) {
    const activeKeys = new Set<string>()

    for (const group of groups) {
      activeKeys.add(group.key)

      const sig = groupSignature(group)
      const cached = groupCache.get(group.key)

      if (cached?.sig === sig) {
        mergeItems(items, cached.items)
        debug.push(...cached.debug.slice(0, Math.max(0, DEBUG_SAMPLE_SIZE - debug.length)))
        continue
      }

      try {
        const resolved = resolveGroupRelatedPosts(group)
        groupCache.set(group.key, { sig, items: resolved.items, debug: resolved.debug })
        mergeItems(items, resolved.items)
        debug.push(...resolved.debug.slice(0, Math.max(0, DEBUG_SAMPLE_SIZE - debug.length)))
      }
      catch (error) {
        logger.error(`Failed to resolve related posts of "${group.key}":`, error)
      }
    }

    // 清理已不存在分组的缓存
    for (const key of groupCache.keys()) {
      if (!activeKeys.has(key))
        groupCache.delete(key)
    }
  }
  else {
    groupCache.clear()
  }

  applyManualRelatedPosts(pages, options, items)

  let written = 0

  for (const [path, list] of items) {
    if (!list.length)
      continue

    const page = pageByPath.get(path)
    if (!page)
      continue

    page.data.relatedPosts = list
    written++
  }

  let empty = 0
  for (const group of groups) {
    for (const doc of group.docs) {
      if (!items.get(doc.path)?.length)
        empty++
    }
  }

  let total = 0
  for (const list of items.values())
    total += list.length

  const average = written ? (total / written).toFixed(1) : '0'

  const summary = `related posts: ${written} pages, avg ${average}, `
    + `${empty} without candidates in ${groups.length} group(s)`

  if (app.env.isBuild)
    logger.info(summary)

  if (debug.length)
    logger.info(`[related-posts]\n${debug.join('\n')}`)

  perf.log('prepare:related-posts')
}
