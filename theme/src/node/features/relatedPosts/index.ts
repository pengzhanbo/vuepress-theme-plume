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
import type { SeriesRelatedIndex, SeriesScoreMultiplier } from '../series/index.js'
import type { RelatedPostsDoc, RelatedPostsGroup } from './collect.js'
import type { FieldBoosts } from './score.js'
import { logger } from '../../utils/index.js'
import { findCollection } from '../collections/index.js'
import { toCanonicalRoute } from '../draft.js'
import { isEncryptPage } from '../encrypt.js'
import { createSeriesMultiplier, resolveSeriesRelatedIndex } from '../series/related.js'
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
 * Context of the related posts resolution.
 *
 * 相关文章计算的上下文。
 */
export interface RelatedPostsResolveContext {
  /**
   * Series index used to adjust the score of in-series candidates.
   *
   * 用于调整同系列候选分数的系列索引。
   */
  series?: SeriesRelatedIndex
  /**
   * Whether the app is building. Only used when the series index has to be built on
   * demand by {@link resolveRelatedPosts}.
   *
   * 是否为生产构建。仅当 {@link resolveRelatedPosts} 需要自行构建系列索引时使用。
   */
  isBuild?: boolean
}

/**
 * Max number of dropped candidate paths kept per page for the debug log.
 *
 * 每页在调试日志中最多保留的被剔除候选路径数。
 */
const DEBUG_REMOVED_PATHS = 3

/**
 * Candidates dropped by a zero multiplier on one page.
 *
 * 一页中被零乘数剔除的候选。
 */
interface RemovedCandidates {
  /** Total number of dropped candidates / 被剔除的候选总数 */
  count: number
  /** A few dropped paths kept for the debug log / 供调试日志使用的少量被剔除路径 */
  paths: string[]
}

/**
 * Format the debug marker of a multiplier.
 *
 * 格式化乘数的调试标记。
 */
function formatRatio(ratio: number): string {
  return `×${Number(ratio.toFixed(2))}`
}

/**
 * Format the dropped candidates of one page. Only the sampled paths are printed, the
 * rest is summarized by its count.
 *
 * 格式化一页被剔除的候选。仅打印样例路径，其余以数量概述。
 *
 * @param record - Dropped candidates of one page / 一页被剔除的候选
 */
function formatRemoved(record: RemovedCandidates): string {
  const sample = [...record.paths].sort()
  const more = record.count - sample.length

  return `  · removed ${formatRatio(0)}  ${sample.join(' ')}${more > 0 ? ` (+${more} more)` : ''}`
}

/**
 * Resolve related posts of one document group.
 *
 * 计算一个文档分组内的相关文章。
 *
 * @param group - Document group / 文档分组
 * @param context - Resolution context / 计算上下文
 */
export function resolveGroupRelatedPosts(
  group: RelatedPostsGroup,
  context: RelatedPostsResolveContext = {},
): {
  items: Map<string, ThemeRelatedPostItem[]>
  debug: string[]
} {
  const items = new Map<string, ThemeRelatedPostItem[]>()
  const debug: string[] = []

  if (group.docs.length < 2)
    return { items, debug }

  const { debug: isDebug, seriesBoost, seriesNextBoost } = group.options
  const docs = buildDocTerms(group)
  const index = buildIndex(docs, toFieldBoosts(group.options.weights))

  const multiplier = createSeriesMultiplier(
    docs.map(doc => doc.path),
    context.series,
    { boost: seriesBoost, next: seriesNextBoost },
  )

  // 统计被乘数为 0 剔除的候选数量，仅保留少量路径供 debug 日志使用：
  // 大系列中全部记录并格式化每一页会明显放大日志与内存开销
  const removed: RemovedCandidates[] = docs.map(() => ({ count: 0, paths: [] }))

  const boost: SeriesScoreMultiplier | undefined = multiplier
    ? (from, to) => {
        const ratio = multiplier(from, to)
        if (ratio <= 0 && isDebug) {
          const record = removed[from]
          record.count++
          if (record.paths.length < DEBUG_REMOVED_PATHS)
            record.paths.push(docs[to].path)
        }
        return ratio
      }
    : undefined

  const scored = scoreAll(index, group.options, boost)
  const { limit, diversity } = group.options

  docs.forEach((doc, i) => {
    // 先取更宽的候选池，再在其中做多样性筛选
    const pool = scored[i].slice(0, limit * TOPK_FACTOR)

    const candidates = !pool.length
      ? []
      : diversity > 0
        ? selectDiverse(
            pool,
            limit,
            (a, b) => cosineSimilarity(index, a, b),
            1 - diversity,
          )
        : pool.slice(0, limit)

    if (candidates.length)
      items.set(doc.path, candidates.map(candidate => toItem(docs[candidate.index])))

    if (isDebug && (candidates.length || removed[i].count)) {
      debug.push([
        doc.path,
        ...candidates.map((candidate) => {
          const ratio = multiplier?.(i, candidate.index) ?? 1
          const mark = ratio === 1 ? '' : ` ${formatRatio(ratio)}`
          return `  ${candidate.score.toFixed(3)}${mark}  ${docs[candidate.index].path}`
        }),
        ...(removed[i].count ? [formatRemoved(removed[i])] : []),
      ].join('\n'))
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
  options: ThemeOptions,
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

    if (isEncryptPage(target, options.encrypt)) {
      logger.warn(
        `The related post "${link}" declared in ${page.filePathRelative} is encrypted and cannot be recommended.`,
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
 * @param context - Resolution context, the series index is built on demand when omitted
 *                  计算上下文，缺省时按需构建系列索引
 */
export function resolveRelatedPosts(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
  context: RelatedPostsResolveContext = {},
): ResolveRelatedPostsResult {
  const items = new Map<string, ThemeRelatedPostItem[]>()
  const debug: string[] = []

  const groups = collectRelatedPostsGroups(pages, options)

  if (!hasSegmenter && groups.length)
    logger.info('`Intl.Segmenter` is not available, falling back to the 2-gram CJK tokenizer.')

  // 系列索引默认按生产视图构建：相关文章本身也不推荐草稿
  // The series index defaults to the build view, related posts never recommend drafts
  const series = groups.length
    ? context.series ?? resolveSeriesRelatedIndex(pages, options, context.isBuild ?? true)
    : undefined

  for (const group of groups) {
    const resolved = resolveGroupRelatedPosts(group, { series })
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

    const manualItems = resolveManualItems(page, pageIndex, options)
    if (manualItems.length)
      items.set(page.path, manualItems)
    else
      items.delete(page.path)
  }
}
