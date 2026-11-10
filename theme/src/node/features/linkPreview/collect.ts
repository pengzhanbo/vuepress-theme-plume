import type { Page } from 'vuepress'
import type {
  EncryptOptions,
  ThemeLinkPreviewItem,
  ThemeOptions,
  ThemePageData,
} from '../../../shared/index.js'
import { logger } from '../../utils/index.js'
import { isEncryptPage } from '../encrypt.js'
import { resolvePageTags } from '../page-meta.js'
import { resolveExcerpt } from './excerpt.js'
import { normalizePreviewPath, resolveLinkKey } from './key.js'
import { type ResolvedLinkPreviewOptions, resolveLocaleLinkPreviewOptions } from './options.js'
import { extractRawHrefs, resolveRawHrefKey } from './raw-links.js'

/**
 * Max previews collected per page, protecting the page chunk against extreme pages
 * (e.g. a huge index page).
 *
 * 单页最多收集多少条预览，防止极端页面（如超大索引页）撑大 chunk。
 */
const MAX_PREVIEW_LINKS = 200

/**
 * Max tags written into one preview item.
 *
 * 单个预览项最多写入的标签数量。
 */
const MAX_TAGS = 4

/**
 * Result of a collection run, used for logging only.
 *
 * 一次收集的结果，仅用于日志统计。
 */
export interface CollectResult {
  /**
   * Pages that received preview data
   *
   * 实际写入预览数据的页面数
   */
  pages: number
  /**
   * Scanned internal links
   *
   * 扫描到的内链总数
   */
  links: number
  /**
   * Written preview items
   *
   * 写入的预览条目总数
   */
  items: number
}

/**
 * Check whether the page is a preview target.
 *
 * 判断目标页是否可以作为预览目标（安全红线）。
 *
 * @param target - Target page / 目标页面
 * @param sourceKey - Normalized key of the source page / 源页的归一化键
 * @param options - Resolved options / 归一化后的配置
 * @param encrypt - Encrypt options / 加密配置
 */
function isPreviewableTarget(
  target: Page<ThemePageData>,
  sourceKey: string,
  options: ResolvedLinkPreviewOptions,
  encrypt?: EncryptOptions,
): boolean {
  const key = normalizePreviewPath(target.path)

  // 1. 指向自身：无意义
  if (key === sourceKey)
    return false
  // 2. 加密页面
  if (isEncryptPage(target, encrypt))
    return false
  // 3. 草稿：build 下页面已不存在
  if (target.frontmatter.draft)
    return false
  // 4. 用户显式排除
  if (options.excludeMatcher && options.excludeMatcher(key))
    return false

  return true
}

/**
 * Check whether the page should receive preview data.
 *
 * 判断源页是否需要生成预览数据。
 *
 * @param page - Source page / 源页
 */
function isPreviewSource(page: Page<ThemePageData>): boolean {
  // 只有渲染 `.vp-doc` 的页面才需要（home / friends / posts 列表页等跳过）
  const layout = page.frontmatter.pageLayout
  if (page.frontmatter.home || page.frontmatter.friends)
    return false
  if (layout && layout !== 'doc' && layout !== 'page')
    return false
  // 用户显式关闭
  if (page.frontmatter.linkPreview === false)
    return false
  // 没有任何内链
  return page.links.length > 0 || page.contentRendered.includes('<a')
}

/**
 * Create the preview item of a target page.
 *
 * 组装目标页的预览项。
 *
 * @param page - Target page / 目标页面
 * @param options - Resolved options / 归一化后的配置
 */
export function createLinkPreviewItem(
  page: Page<ThemePageData>,
  options: ResolvedLinkPreviewOptions,
): ThemeLinkPreviewItem {
  const item: ThemeLinkPreviewItem = { title: page.title }

  if (options.showExcerpt) {
    const excerpt = resolveExcerpt(page, options.excerptLength)
    if (excerpt)
      item.excerpt = excerpt
  }

  if (options.showHeadings && options.headingsLimit > 0) {
    const headings = page.headers
      .filter(header => header.level >= 2)
      .slice(0, options.headingsLimit)
      .map(header => header.title.replace(/`/g, '').trim())
      .filter(Boolean)

    if (headings.length)
      item.headings = headings
  }

  if (options.showTags) {
    const tags = resolvePageTags(page, MAX_TAGS)
    if (tags.length)
      item.tags = tags
  }

  if (options.showUpdatedTime) {
    // git 插件在构建期默认开启，dev 下默认关闭 → 开发环境不显示时间
    const updatedTime = page.data.git?.updatedTime
    if (updatedTime)
      item.updatedTime = updatedTime
  }

  return item
}

/**
 * Collect link previews and write them into `page.data.linkPreviews`.
 *
 * 收集内链预览并直接写入 `page.data.linkPreviews`：先清理旧字段，再逐页解析
 * `page.links` 与裸 HTML 锚点、过滤不安全或不可用的目标，最后组装预览项。
 *
 * @param pages - All pages / 全部页面
 * @param options - Theme options / 主题配置
 * @param base - Site base / 站点 base
 */
export function collectLinkPreviews(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
  base: string,
): CollectResult {
  const byPath = new Map<string, Page<ThemePageData>>()

  for (const page of pages) {
    byPath.set(normalizePreviewPath(page.path), page)
    // 每轮先清理，避免关闭功能 / 页面被排除后遗留旧数据
    // Clean up first so disabling the feature leaves no stale data
    if ('linkPreviews' in page.data)
      delete page.data.linkPreviews
  }

  // VuePress 会为 `permalink` 页面生成「推断路径 → permalink」的重定向，
  // `RouteLink` 渲染出的 `href` 使用的正是重定向后的 permalink。
  // 因此构建期的键也必须做同样的映射，否则指向 permalink 页面的 `.md` 链接会全部落空。
  const byInferred = new Map<string, Page<ThemePageData>>()

  for (const page of pages) {
    if (!page.pathInferred)
      continue

    const key = normalizePreviewPath(page.pathInferred)
    if (!byPath.has(key))
      byInferred.set(key, page)
  }

  function findTarget(key: string): Page<ThemePageData> | undefined {
    return byPath.get(key) ?? byInferred.get(key)
  }

  // 同一目标页在一次构建中只计算一次
  const itemCache = new Map<string, ThemeLinkPreviewItem>()

  let pageCount = 0
  let linkCount = 0
  let itemCount = 0

  for (const page of pages) {
    // A. 该页所属语言的开关：未开启则该页不产出任何数据
    const resolved = resolveLocaleLinkPreviewOptions(options, page.pathLocale)
    if (!resolved || !isPreviewSource(page))
      continue

    // B. 源页自身的路由键：用于剔除「指向自己」的内链
    const sourceKey = normalizePreviewPath(page.path)
    const previews: Record<string, ThemeLinkPreviewItem> = {}
    let count = 0
    let limited = false

    const candidates: string[] = []

    for (const link of page.links) {
      const key = resolveLinkKey(link, base)
      if (key)
        candidates.push(key)
    }

    for (const href of extractRawHrefs(page.contentRendered)) {
      const key = resolveRawHrefKey(href, page.path, base)
      if (key)
        candidates.push(key)
    }

    for (const key of candidates) {
      linkCount++

      const target = findTarget(key)
      if (!target)
        continue

      // 客户端由渲染后的 `href` 计算键，即 permalink 页面的最终路由
      const targetKey = normalizePreviewPath(target.path)

      // 同一链接重复出现时按 key 去重，保留首次
      if (previews[targetKey])
        continue

      if (!isPreviewableTarget(target, sourceKey, resolved, options.encrypt))
        continue

      if (count >= MAX_PREVIEW_LINKS) {
        limited = true
        break
      }

      const cacheKey = `${page.pathLocale}\n${targetKey}`
      let item = itemCache.get(cacheKey)
      if (!item) {
        item = createLinkPreviewItem(target, resolved)
        itemCache.set(cacheKey, item)
      }

      previews[targetKey] = item
      count++
    }

    if (limited) {
      logger.warn(
        `[link-preview] "${page.filePathRelative ?? page.path}" has more than `
        + `${MAX_PREVIEW_LINKS} previewable links, the rest is skipped.`,
      )
    }

    if (count) {
      page.data.linkPreviews = previews
      pageCount++
      itemCount += count
    }
  }

  return { pages: pageCount, links: linkCount, items: itemCount }
}
