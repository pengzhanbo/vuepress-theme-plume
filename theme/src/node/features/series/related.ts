/**
 * Series index shared with the related posts feature
 *
 * 供相关文章使用的系列索引
 */

import type { Page } from 'vuepress'
import type { ThemeOptions, ThemePageData } from '../../../shared/index.js'
import type { ResolvedSeries } from './collect.js'
import { hash } from '../../utils/index.js'
import { collectSeries } from './collect.js'
import { normalizeSeriesId } from './options.js'

/**
 * Membership of a page inside a series.
 *
 * 一个页面在系列中的归属信息。
 */
export interface SeriesMemberRef {
  /** Series key, `${locale}::${id}` / 系列键，`${locale}::${id}` */
  key: string
  /** Series id / 系列 id */
  id: string
  /** Locale the series belongs to / 系列所属语言 */
  locale: string
  /** 1-based order in the series / 系列内篇号（从 1 开始） */
  order: number
  /** Chapter count of the series / 系列章节总数 */
  total: number
  /** Path of the previous chapter / 上一章路径 */
  prev?: string
  /** Path of the next chapter / 下一章路径 */
  next?: string
  /**
   * Whether the in-page "next chapter" block is rendered on this page, mirroring
   * `useSeries().enabled` on the client.
   *
   * 该页是否渲染文末「下一篇」，与客户端的 `useSeries().enabled` 保持一致。
   */
  nav: boolean
}

/**
 * Series membership of every chapter, used to adjust related posts scores.
 *
 * 全部章节的系列归属，用于调整相关文章分数。
 */
export interface SeriesRelatedIndex {
  /** Page path → membership / 页面路径 → 归属信息 */
  members: Map<string, SeriesMemberRef>
  /**
   * Signature of the whole index, used to validate the related posts cache. It changes
   * whenever a chapter is added, removed or reordered in any series.
   *
   * 整个索引的签名，用于校验相关文章缓存。任意系列增删或调整顺序都会改变它。
   */
  signature: string
}

/**
 * Multipliers of the series signals.
 *
 * 系列信号乘数。
 */
export interface SeriesRelatedWeights {
  /** Same series multiplier / 同系列乘数 */
  boost: number
  /** Next chapter multiplier / 下一篇乘数 */
  next: number
}

/**
 * Score multiplier of the series signals.
 *
 * 系列信号的分数乘数。
 */
export type SeriesScoreMultiplier = (from: number, to: number) => number

/**
 * Build the series index of the related posts feature.
 *
 * 构建相关文章使用的系列索引。
 *
 * @param series - Resolved series / 解析后的系列
 */
export function createSeriesRelatedIndex(series: ResolvedSeries[]): SeriesRelatedIndex {
  const members = new Map<string, SeriesMemberRef>()
  const signatures: string[] = []

  for (const item of series) {
    const { chapters } = item

    const navs = chapters.map(chapter =>
      item.nav !== false && chapter.page.frontmatter.seriesNav !== false,
    )

    chapters.forEach((chapter, index) => {
      members.set(chapter.path, {
        key: `${item.locale}::${item.id}`,
        id: item.id,
        locale: item.locale,
        order: chapter.order,
        total: chapters.length,
        prev: chapters[index - 1]?.path,
        next: chapters[index + 1]?.path,
        nav: navs[index],
      })
    })

    signatures.push(
      `${item.locale}::${item.id}:${
        chapters.map((chapter, index) => `${chapter.path}=${navs[index] ? 1 : 0}`).join('|')}`,
    )
  }

  return { members, signature: hash(signatures.join('\n')) }
}

/**
 * Collect the series index for the related posts feature.
 *
 * 为相关文章收集系列索引。
 *
 * Warnings are suppressed: they are reported once by `prepareSeries`. When no page
 * declares `series`, collection is skipped entirely.
 *
 * 该过程静默运行，告警由 `prepareSeries` 统一输出。没有任何页面声明 `series` 时完全跳过收集。
 *
 * @param pages - All pages / 全部页面
 * @param options - Theme options / 主题配置
 * @param isBuild - Whether the app is building / 是否为生产构建
 * @returns Series index, `undefined` when no page declares a series
 *          系列索引，没有页面声明系列时为 `undefined`
 */
export function resolveSeriesRelatedIndex(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
  isBuild: boolean,
): SeriesRelatedIndex | undefined {
  if (!pages.some(page => normalizeSeriesId(page.frontmatter.series)))
    return undefined

  return createSeriesRelatedIndex(
    collectSeries(pages, options, { isBuild, quiet: true }),
  )
}

/**
 * Create the score multiplier of the series signals.
 *
 * 创建系列信号的分数乘数。
 *
 * @param paths - Candidate paths, indexed by their position in the group / 候选路径，按分组内的下标排列
 * @param index - Series index, `undefined` disables the feature / 系列索引，为 `undefined` 时关闭
 * @param weights - Multipliers / 乘数
 * @returns Multiplier, `undefined` when nothing has to be adjusted
 *          乘数函数，无需调整时为 `undefined`
 */
export function createSeriesMultiplier(
  paths: string[],
  index: SeriesRelatedIndex | undefined,
  weights: SeriesRelatedWeights,
): SeriesScoreMultiplier | undefined {
  const { boost, next } = weights

  if (!index?.members.size || (boost === 1 && next === 1))
    return undefined

  return (from, to) => {
    const source = index.members.get(paths[from])
    const target = paths[to]

    if (!source || !target || index.members.get(target)?.key !== source.key)
      return 1

    // 文末已展示「下一篇」时不再重复推荐 / The next chapter is already shown below the content
    return source.nav && source.next === target ? boost * next : boost
  }
}
