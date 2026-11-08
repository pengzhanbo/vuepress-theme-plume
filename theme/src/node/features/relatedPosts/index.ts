/**
 * Related posts resolution
 *
 * 相关文章推荐的计算入口
 */

import type { Page } from 'vuepress'
import type {
  RelatedPostsWeights,
  ThemeOptions,
  ThemePageData,
  ThemePostFrontmatter,
  ThemeRelatedPostItem,
} from '../../../shared/index.js'
import type { RelatedPostsDoc, RelatedPostsGroup } from './collect.js'
import type { FieldBoosts } from './score.js'
import { logger } from '../../utils/index.js'
import { findCollection } from '../collections/index.js'
import { toCanonicalRoute } from '../draft.js'
import {
  buildDocTerms,
  collectRelatedPostsGroups,
  resolveCollectionRelatedPostsOptions,
} from './collect.js'
import { buildIndex, cosineSimilarity, scoreAll, selectDiverse, TOPK_FACTOR } from './score.js'
import { hasSegmenter } from './tokenize.js'

export type { RelatedPostsDoc, RelatedPostsGroup } from './collect.js'

/**
 * Max number of pages printed in debug mode.
 *
 * debug 模式下最多打印的页面数量
 */
const DEBUG_SAMPLE_SIZE = 20

/**
 * Result of a full resolution pass
 *
 * 一次完整计算的结果
 */
export interface ResolveRelatedPostsResult {
  /** Page path → related items / 页面路径 → 相关文章 */
  items: Map<string, ThemeRelatedPostItem[]>
  /** Debug lines, empty when `debug` is disabled / debug 输出行，未开启时为空 */
  debug: string[]
}

function toFieldBoosts(weights: Required<RelatedPostsWeights>): FieldBoosts {
  return {
    t: weights.title,
    g: weights.tags,
    c: weights.category,
    h: weights.headings,
    b: weights.content,
  }
}

function toItem(doc: RelatedPostsDoc): ThemeRelatedPostItem {
  const item: ThemeRelatedPostItem = {
    path: doc.path,
    title: doc.title,
  }

  if (doc.tags.length)
    item.tags = doc.tags.slice(0, 3)

  if (doc.createTimeText)
    item.createTime = doc.createTimeText

  if (doc.excerpt)
    item.excerpt = doc.excerpt

  return item
}

/**
 * Resolve related posts of one document group.
 *
 * 计算一个文档分组内的相关文章。
 *
 * @param group - Document group / 文档分组
 */
export function resolveGroupRelatedPosts(group: RelatedPostsGroup): {
  items: Map<string, ThemeRelatedPostItem[]>
  debug: string[]
} {
  const items = new Map<string, ThemeRelatedPostItem[]>()
  const debug: string[] = []

  if (group.docs.length < 2)
    return { items, debug }

  const docs = buildDocTerms(group)
  const index = buildIndex(docs, toFieldBoosts(group.options.weights))
  const scored = scoreAll(index, group.options)
  const { limit, diversity } = group.options

  docs.forEach((doc, i) => {
    // 先取更宽的候选池，再在其中做多样性筛选
    const pool = scored[i].slice(0, limit * TOPK_FACTOR)
    if (!pool.length)
      return

    const candidates = diversity > 0
      ? selectDiverse(
          pool,
          limit,
          (a, b) => cosineSimilarity(index, a, b),
          1 - diversity,
        )
      : pool.slice(0, limit)

    items.set(doc.path, candidates.map(candidate => toItem(docs[candidate.index])))

    if (group.options.debug) {
      debug.push(
        `${doc.path}\n${
          candidates
            .map(candidate => `  ${candidate.score.toFixed(3)}  ${docs[candidate.index].path}`)
            .join('\n')}`,
      )
    }
  })

  return { items, debug }
}

function normalizeRelatedLinks(links: string[]): string[] {
  return links.filter(link => typeof link === 'string' && !!link.trim())
}

function resolveManualItems(
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>,
  pageIndex: Map<string, Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>>,
): ThemeRelatedPostItem[] {
  const links = normalizeRelatedLinks(page.frontmatter.relatedPosts as string[])
  const items: ThemeRelatedPostItem[] = []

  for (const link of links) {
    const target = pageIndex.get(toCanonicalRoute(link))

    if (!target) {
      logger.warn(
        `The related post "${link}" declared in ${page.filePathRelative} does not exist.`,
      )
      continue
    }

    items.push({
      path: target.path,
      title: target.title,
      tags: Array.isArray(target.frontmatter.tags)
        ? (target.frontmatter.tags as string[]).slice(0, 3)
        : undefined,
    })
  }

  return items
}

/**
 * Resolve related posts for every page.
 *
 * 为所有页面计算相关文章。
 *
 * @param pages - All pages of the app / 应用的全部页面
 * @param options - Theme options / 主题配置
 */
export function resolveRelatedPosts(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
): ResolveRelatedPostsResult {
  const items = new Map<string, ThemeRelatedPostItem[]>()
  const debug: string[] = []

  const groups = collectRelatedPostsGroups(pages, options)

  if (!hasSegmenter && groups.length)
    logger.info('`Intl.Segmenter` is not available, falling back to the 2-gram CJK tokenizer.')

  for (const group of groups) {
    const resolved = resolveGroupRelatedPosts(group)
    for (const [path, list] of resolved.items)
      items.set(path, list)

    if (debug.length < DEBUG_SAMPLE_SIZE)
      debug.push(...resolved.debug.slice(0, DEBUG_SAMPLE_SIZE - debug.length))
  }

  applyManualRelatedPosts(pages, options, items)

  return { items, debug }
}

/**
 * Apply the manual `frontmatter.relatedPosts` list on top of the computed result.
 *
 * 用 `frontmatter.relatedPosts` 手动列表覆盖计算结果。
 *
 * The manual list is parsed at build time, so the client only ever reads
 * `page.data.relatedPosts` and never has to resolve links itself.
 *
 * 手动列表在构建期解析，因此客户端只读取 `page.data.relatedPosts`，不再自行解析链接。
 *
 * @param pages - All pages of the app / 应用的全部页面
 * @param options - Theme options / 主题配置
 * @param items - Computed result, mutated in place / 计算结果，会被就地修改
 */
export function applyManualRelatedPosts(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
  items: Map<string, ThemeRelatedPostItem[]>,
): void {
  const typedPages = pages as Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>[]
  const pageIndex = new Map<string, Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>>()
  for (const page of typedPages)
    pageIndex.set(toCanonicalRoute(page.path), page)

  for (const page of typedPages) {
    const manual = page.frontmatter.relatedPosts
    if (manual !== false && !Array.isArray(manual))
      continue

    // 未开启推荐的集合不处理手动列表，与集合级开关保持一致
    const collection = findCollection(page, options)
    if (!collection || !resolveCollectionRelatedPostsOptions(options, collection, page.pathLocale))
      continue

    if (manual === false) {
      items.delete(page.path)
      continue
    }

    const manualItems = resolveManualItems(page, pageIndex)
    if (manualItems.length)
      items.set(page.path, manualItems)
    else
      items.delete(page.path)
  }
}
