/**
 * Series collection, sorting and validation
 *
 * 系列的收集、排序与校验
 */

import type { Page } from 'vuepress'
import type { SeriesItemOptions, SeriesOrder, ThemeOptions, ThemePageData } from '../../../shared/index.js'
import type { ResolvedSeriesOptions } from './options.js'
import { ensureEndingSlash, isLinkExternal } from '@vuepress/helper'
import { logger } from '../../utils/index.js'
import { isPublicContentPage } from '../content.js'
import { isEncryptPage } from '../encrypt.js'
import { formatPostDate, resolvePageCreateTime } from '../page-meta.js'
import {
  hasSeriesOptions,
  normalizeSeriesId,
  resolveSeriesLink,
  resolveSeriesOptions,
  resolveSeriesPagePath,
} from './options.js'

/**
 * Sink of the human readable warnings.
 *
 * 告警输出函数。
 */
export type SeriesWarn = (message: string) => void

/**
 * A chapter kept at build time. It holds the `Page` reference, so it must never be
 * serialized into the client module.
 *
 * 构建期章节：保留 `Page` 引用，供读取 frontmatter / 日志定位使用，不进入虚拟模块。
 */
export interface SeriesChapterInternal {
  page: Page<ThemePageData>
  path: string
  title: string
  /** Declared `seriesOrder`, `undefined` when not declared / 声明的篇号 */
  explicit?: number
  /** Create time in milliseconds, `undefined` when unknown / 创建时间（毫秒） */
  time?: number
  createTimeText?: string
  /** Reading time in minutes / 预计阅读分钟数 */
  readingTime?: number
  draft: boolean
  /** 1-based index assigned after sorting / 排序后赋值的篇号 */
  order: number
}

/**
 * Resolved series used at build time.
 *
 * 构建期解析出的系列。
 */
export interface ResolvedSeries {
  id: string
  /** Locale the series belongs to, taken from `page.pathLocale` / 所属语言 */
  locale: string
  /** Page language, written into the landing page frontmatter / 页面 lang */
  lang: string
  title: string
  description?: string
  cover?: string
  /**
   * Landing page path, only present when the page is about to be created.
   * A `page: false` series never has one.
   *
   * 落地页路径，仅在准备创建页面时存在；`page: false` 时恒为 `undefined`
   */
  pagePath?: string
  /**
   * Public link of the series, which may point to a page managed by the author.
   *
   * 对外可点击的系列链接，可能指向作者自行维护的页面
   */
  link?: string
  order: SeriesOrder
  nav: boolean
  chapters: SeriesChapterInternal[]
}

/**
 * Context of {@link collectSeries}.
 *
 * {@link collectSeries} 的上下文。
 */
export interface CollectSeriesContext {
  /**
   * Whether the app is building. Draft pages are kept in dev only.
   *
   * 是否为生产构建。草稿页仅在开发模式下保留。
   */
  isBuild: boolean
  /**
   * Existing page paths, used to detect landing page conflicts. The set is mutated
   * so that two series resolving to the same path conflict with each other.
   *
   * 已占用的页面路径，用于检测落地页冲突。该集合会被写入，使两个系列之间的路径冲突也能被发现。
   */
  occupiedPaths?: Set<string>
  /**
   * Suppress warnings. Used by the landing page pass, whose findings are reported
   * again by `prepareSeries` (the single logging point).
   *
   * 是否静默告警。落地页生成阶段使用该选项，其结论会由 `prepareSeries` 统一输出一次。
   */
  quiet?: boolean
}

/**
 * Parse the raw `seriesOrder` value.
 *
 * 解析原始的 `seriesOrder` 值。
 */
function resolveExplicitOrder(
  value: unknown,
  page: Page<ThemePageData>,
  warn: SeriesWarn,
): number | undefined {
  if (value === undefined || value === null || value === '')
    return undefined

  if (typeof value === 'number' && Number.isFinite(value))
    return value

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed))
      return parsed
  }

  warn(`[series] ${page.filePathRelative ?? page.path}: \`seriesOrder\` is not a number, it has been ignored.`)
  return undefined
}

function toChapter(page: Page<ThemePageData>, warn: SeriesWarn): SeriesChapterInternal {
  const created = resolvePageCreateTime(page)
  const minutes = page.data.readingTime?.minutes

  return {
    page,
    path: page.path,
    title: page.title,
    explicit: resolveExplicitOrder(page.frontmatter.seriesOrder, page, warn),
    time: created?.getTime(),
    createTimeText: created ? formatPostDate(created) : undefined,
    readingTime: minutes ? Math.max(1, Math.ceil(minutes)) : undefined,
    draft: page.frontmatter.draft === true,
    order: 0,
  }
}

function fileOf(chapter: SeriesChapterInternal): string {
  return chapter.page.filePathRelative ?? chapter.path
}

function warnDuplicatedOrders(
  chapters: SeriesChapterInternal[],
  id: string,
  locale: string,
  warn: SeriesWarn,
): void {
  const groups = new Map<number, SeriesChapterInternal[]>()

  for (const chapter of chapters) {
    if (chapter.explicit == null)
      continue
    const list = groups.get(chapter.explicit) ?? []
    list.push(chapter)
    groups.set(chapter.explicit, list)
  }

  for (const [order, list] of groups) {
    if (list.length < 2)
      continue
    const files = list.map(chapter => `  - ${fileOf(chapter)}`).join('\n')
    warn(`[series] "${id}" (${locale}): duplicated \`seriesOrder\` ${order}:\n${files}`)
  }
}

/**
 * Sort chapters in place and assign the 1-based order.
 *
 * The comparator is fully deterministic: strategy → create time → path.
 *
 * 就地排序并赋予 1 起始的篇号。比较键完全确定：策略 → 创建时间 → 路径。
 */
function sortChapters(
  chapters: SeriesChapterInternal[],
  strategy: SeriesOrder,
  id: string,
  locale: string,
  warn: SeriesWarn,
): void {
  const allExplicit = chapters.every(chapter => chapter.explicit != null)
  const declared = chapters.filter(chapter => chapter.explicit != null)

  let effective = strategy

  if (strategy === 'auto') {
    effective = allExplicit ? 'order' : 'time'
    if (!allExplicit && declared.length) {
      warn(
        `[series] "${id}" (${locale}): ${declared.length} of ${chapters.length} chapters declare \`seriesOrder\`, the whole series is sorted by create time instead.`,
      )
    }
  }
  else if (strategy === 'order' && !allExplicit) {
    const files = chapters
      .filter(chapter => chapter.explicit == null)
      .map(chapter => `  - ${fileOf(chapter)}`)
      .join('\n')
    warn(
      `[series] "${id}" (${locale}): \`order: 'order'\` is used but some chapters do not declare \`seriesOrder\`, they are placed at the end:\n${files}`,
    )
  }

  warnDuplicatedOrders(chapters, id, locale, warn)

  chapters.sort((a, b) => {
    if (effective === 'order') {
      const diff = (a.explicit ?? Number.POSITIVE_INFINITY) - (b.explicit ?? Number.POSITIVE_INFINITY)
      if (diff)
        return diff
    }

    const timeDiff = (a.time ?? Number.POSITIVE_INFINITY) - (b.time ?? Number.POSITIVE_INFINITY)
    if (timeDiff)
      return timeDiff

    return a.path.localeCompare(b.path)
  })

  chapters.forEach((chapter, index) => {
    chapter.order = index + 1
  })
}

interface SeriesGroup {
  locale: string
  id: string
  pages: Page<ThemePageData>[]
}

/**
 * Resolve the landing page path and the public link of a series.
 *
 * 解析系列的落地页路径与对外链接。
 */
function resolveLinks(
  id: string,
  item: SeriesItemOptions | undefined,
  options: ResolvedSeriesOptions,
  locale: string,
  warn: SeriesWarn,
  occupiedPaths?: Set<string>,
): { pagePath?: string, link?: string } {
  const pageEnabled = options.page && item?.page !== false

  if (pageEnabled) {
    const pagePath = resolveSeriesPagePath(id, item, options, locale)

    if (occupiedPaths) {
      if (occupiedPaths.has(pagePath)) {
        warn(`[series] "${id}" (${locale}): landing page path ${pagePath} is already used, it has been skipped.`)
        return {}
      }
      occupiedPaths.add(pagePath)
    }

    return { pagePath, link: pagePath }
  }

  // `page: false` 表示作者自行管理落地页 / The author manages the landing page
  if (!item?.link)
    return {}

  const link = resolveSeriesLink(item.link, locale)

  // 站外链接没有对应的站内页面，跳过占用检查
  // An external link has no local page, so the occupancy check does not apply
  if (occupiedPaths && !isLinkExternal(link) && !isOccupied(occupiedPaths, link))
    warn(`[series] "${id}" (${locale}): \`link\` points to ${link}, but no page is found at this path.`)

  return { link }
}

/**
 * Check whether a manually written link points at an existing page.
 *
 * The link keeps the trailing slash the author wrote, while `page.path` always ends
 * with one, so both forms are compared.
 *
 * 判断手写链接是否指向已有页面。链接保留作者书写的结尾斜杠，
 * 而 `page.path` 总是带结尾斜杠，因此两种形式都要比较。
 */
function isOccupied(paths: Set<string>, link: string): boolean {
  return paths.has(link)
    || paths.has(ensureEndingSlash(link))
    || paths.has(link.replace(/\/+$/, ''))
}

/**
 * Collect and resolve every series of the app.
 *
 * 收集并解析全站系列。输出已排序、已编号、已过滤的系列列表。
 *
 * @param pages - All pages / 全部页面
 * @param options - Theme options / 主题配置
 * @param context - Collection context / 收集上下文
 */
export function collectSeries(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
  context: CollectSeriesContext,
): ResolvedSeries[] {
  const { isBuild, occupiedPaths, quiet = false } = context
  const warn: SeriesWarn = quiet ? () => {} : message => logger.warn(message)
  const groups = new Map<string, SeriesGroup>()
  let declared = 0

  for (const page of pages) {
    try {
      const raw = page.frontmatter.series

      if (raw === undefined || raw === null || raw === '')
        continue

      const id = normalizeSeriesId(raw)

      if (!id) {
        warn(`[series] ${page.filePathRelative ?? page.path}: \`series\` must be a non-empty string, it has been ignored.`)
        continue
      }

      // 索引以对象字面量写进虚拟模块，`__proto__` 会变成原型设置而不是自有属性，
      // 数据会被静默丢弃，因此在入口直接拒绝
      if (id === '__proto__') {
        warn(`[series] ${page.filePathRelative ?? page.path}: \`__proto__\` is a reserved id and cannot be used as a series id.`)
        continue
      }

      declared++

      if (!isPublicContentPage(page, options, { includeDraft: !isBuild })) {
        // 索引是公开静态资源，标题同样不得泄露 / The index is public, titles must not leak either
        if (!quiet && isEncryptPage(page, options.encrypt))
          logger.info(`[series] ${page.filePathRelative ?? page.path}: encrypted page is excluded from any series.`)
        continue
      }

      const locale = page.pathLocale
      const key = `${locale}::${id}`
      const group = groups.get(key) ?? { locale, id, pages: [] }

      group.pages.push(page)
      groups.set(key, group)
    }
    catch (error) {
      logger.error(`[series] failed to read ${page.filePathRelative ?? page.path}:`, error)
    }
  }

  if (!declared)
    return []

  if (!hasSeriesOptions(options)) {
    warn(`[series] ${declared} page(s) declare \`series\`, but the feature is not enabled. Add \`series: {}\` to the theme options to enable it.`)
    return []
  }

  const result: ResolvedSeries[] = []

  for (const group of groups.values()) {
    try {
      const { id, locale } = group
      const resolvedOptions = resolveSeriesOptions(options, locale)

      if (!resolvedOptions)
        continue

      const item = resolvedOptions.items[id]

      if (!item && !resolvedOptions.autoCreate) {
        warn(`[series] "${id}" (${locale}): ${group.pages.length} page(s) declare this series, but it is not declared in \`series.items\` and \`autoCreate\` is disabled, they have been ignored.`)
        continue
      }

      if (!item)
        warn(`[series] "${id}" (${locale}): title is not declared, the id is used instead. Add \`series.items['${id}'].title\` for a better display.`)

      // 单篇系列同样保留：落地页、总览页与订阅频道都以规范路径对外
      const chapters = group.pages.map(page => toChapter(page, warn))

      sortChapters(chapters, item?.order ?? resolvedOptions.order, id, locale, warn)

      const { pagePath, link } = resolveLinks(id, item, resolvedOptions, locale, warn, occupiedPaths)

      result.push({
        id,
        locale,
        lang: group.pages[0]?.lang ?? '',
        title: item?.title || id,
        description: item?.description,
        cover: item?.cover,
        pagePath,
        link,
        order: item?.order ?? resolvedOptions.order,
        nav: item?.nav ?? resolvedOptions.nav,
        chapters,
      })
    }
    catch (error) {
      logger.error(`[series] failed to resolve series "${group.id}" (${group.locale}):`, error)
    }
  }

  return result
}
