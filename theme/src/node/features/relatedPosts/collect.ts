/**
 * Candidate collection for related posts
 *
 * 相关文章推荐的候选池构建
 */

import type { Page } from 'vuepress'
import type {
  RelatedPostsOptions,
  RelatedPostsWeights,
  ThemeCollectionItem,
  ThemeOptions,
  ThemePageData,
  ThemePostFrontmatter,
} from '../../../shared/index.js'
import type { CjkTokenizer } from './tokenize.js'
import { clamp, clampInteger, createMatcher, truncateText } from '../../utils/index.js'
import { findCollection } from '../collections/index.js'
import { isPublicContentPage } from '../content.js'
import { formatPostDate, resolvePageCreateTime, resolvePageTags } from '../page-meta.js'
import { cleanMarkdown, extractHeadings, tokenize } from './tokenize.js'

/**
 * Resolved options with all defaults applied.
 *
 * 已应用全部默认值的配置。
 */
export interface ResolvedRelatedPostsOptions {
  limit: number
  minScore: number
  weights: Required<RelatedPostsWeights>
  recency: number
  /** MMR diversity weight, `0` keeps the pure relevance order / MMR 多样性权重，`0` 表示仅按相关度排序 */
  diversity: number
  scope: 'collection' | 'locale'
  contentLimit: number
  cjk: CjkTokenizer
  showExcerpt: boolean
  excerptLength: number
  title?: string
  exclude: string[]
  debug: boolean
}

/**
 * A page that can be recommended.
 *
 * 可作为推荐来源或目标的页面。
 */
export interface RelatedPostsDoc {
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>
  path: string
  title: string
  tags: string[]
  /** Create time in milliseconds, `0` when unknown / 创建时间（毫秒），未知时为 `0` */
  createTime: number
  /** Formatted create time, aligned with `postsData` / 格式化后的创建时间，与 `postsData` 一致 */
  createTimeText?: string
  excerpt?: string
  /**
   * Field-prefixed weighted term frequency, built lazily by {@link buildDocTerms}
   *
   * 带字段前缀的加权词频，由 {@link buildDocTerms} 延迟构建
   */
  terms?: Map<string, number>
}

/**
 * A document with its term vector ready for scoring.
 *
 * 已完成词项构建、可直接参与打分的文档。
 */
export type ScorableRelatedPostsDoc = RelatedPostsDoc & { terms: Map<string, number> }

/**
 * A group of documents scored together.
 *
 * 一起参与打分的文档分组。
 */
export interface RelatedPostsGroup {
  /** `locale::dir` or `locale::type` / 分组键 */
  key: string
  options: ResolvedRelatedPostsOptions
  docs: RelatedPostsDoc[]
}

const DEFAULT_WEIGHTS: Required<RelatedPostsWeights> = {
  tags: 3,
  category: 2,
  title: 2,
  headings: 1.5,
  content: 1,
}

/**
 * Default MMR diversity weight. Equivalent to `lambda = 0.7` for relevance.
 *
 * 默认的 MMR 多样性权重，等价于相关度权重 `lambda = 0.7`。
 */
const DEFAULT_DIVERSITY = 0.3

function normalizeWeights(weights?: RelatedPostsWeights): Required<RelatedPostsWeights> {
  return {
    tags: Math.max(weights?.tags ?? DEFAULT_WEIGHTS.tags, 0),
    category: Math.max(weights?.category ?? DEFAULT_WEIGHTS.category, 0),
    title: Math.max(weights?.title ?? DEFAULT_WEIGHTS.title, 0),
    headings: Math.max(weights?.headings ?? DEFAULT_WEIGHTS.headings, 0),
    content: Math.max(weights?.content ?? DEFAULT_WEIGHTS.content, 0),
  }
}

/**
 * Apply defaults and clamp every option.
 *
 * 应用默认值并收敛各项配置的取值范围。
 *
 * @param options - Raw options / 原始配置
 * @returns Resolved options, or `null` when the configuration is unusable
 *          解析后的配置，配置不可用时为 `null`
 */
export function normalizeRelatedPostsOptions(
  options: RelatedPostsOptions,
): ResolvedRelatedPostsOptions | null {
  const weights = normalizeWeights(options.weights)

  if (Object.values(weights).every(weight => weight === 0))
    return null

  return {
    limit: clampInteger(options.limit ?? 4, 1, 12),
    minScore: clamp(options.minScore ?? 0.12, 0, 1),
    weights,
    recency: Math.max(options.recency ?? 0, 0),
    diversity: clamp(options.diversity ?? DEFAULT_DIVERSITY, 0, 1),
    scope: options.scope ?? 'collection',
    contentLimit: clampInteger(options.contentLimit ?? 2000, 0, 20000),
    cjk: options.cjk ?? 'segmenter',
    showExcerpt: options.showExcerpt ?? false,
    excerptLength: clampInteger(options.excerptLength ?? 80, 0, 300),
    title: options.title,
    exclude: options.exclude ?? [],
    debug: options.debug ?? false,
  }
}

/**
 * Read the theme level related posts option of a locale.
 *
 * 读取某个语言环境的主题级相关文章配置。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function getLocaleRelatedPostsOptions(
  options: ThemeOptions,
  locale: string,
): boolean | RelatedPostsOptions | undefined {
  return options.locales?.[locale]?.relatedPosts ?? options.relatedPosts
}

/**
 * Resolve an option value, where `true` means "enabled with defaults" and `false` means
 * "disabled".
 *
 * 解析配置值：`true` 表示使用默认配置启用，`false` 表示关闭。
 *
 * @param value - Raw option value / 原始配置值
 */
function resolveOptionValue(
  value: boolean | RelatedPostsOptions | undefined,
): ResolvedRelatedPostsOptions | null {
  if (!value)
    return null

  return normalizeRelatedPostsOptions(value === true ? {} : value)
}

/**
 * Resolve the effective options of a collection.
 *
 * 解析某个集合实际生效的配置：集合级优先于主题级。
 *
 * @param options - Theme options / 主题配置
 * @param collection - Collection of the page / 页面所属集合
 * @param locale - Route locale / 路由语言
 */
export function resolveCollectionRelatedPostsOptions(
  options: ThemeOptions,
  collection: ThemeCollectionItem,
  locale: string,
): ResolvedRelatedPostsOptions | null {
  return resolveOptionValue(
    collection.relatedPosts ?? getLocaleRelatedPostsOptions(options, locale),
  )
}

function resolveExcerpt(
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>,
  options: ResolvedRelatedPostsOptions,
): string | undefined {
  if (!options.showExcerpt || options.excerptLength <= 0)
    return undefined

  const frontmatterExcerpt = page.frontmatter.excerpt
  const text = typeof frontmatterExcerpt === 'string'
    ? frontmatterExcerpt
    : cleanMarkdown(page.content, options.excerptLength * 2)

  const plain = text.replace(/\s+/g, ' ').trim()
  if (!plain)
    return undefined

  return truncateText(plain, options.excerptLength) || undefined
}

function addField(
  terms: Map<string, number>,
  field: string,
  values: string[],
): void {
  const prefix = `#${field}:`
  for (const token of values)
    terms.set(prefix + token, (terms.get(prefix + token) ?? 0) + 1)
}

function resolveTerms(
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>,
  options: ResolvedRelatedPostsOptions,
): Map<string, number> {
  const terms = new Map<string, number>()
  const { cjk, contentLimit } = options

  // 字段权重在建立索引时应用，这里只记录词频，见 `score.ts` 的 `buildIndex`
  addField(terms, 't', tokenize(page.title ?? '', cjk))
  addField(terms, 'g', resolvePageTags(page))
  addField(terms, 'c', (page.data.categoryList ?? []).map(item => item.name))
  addField(terms, 'h', tokenize(extractHeadings(page.content).join(' '), cjk))

  if (contentLimit > 0)
    addField(terms, 'b', tokenize(cleanMarkdown(page.content, contentLimit), cjk))

  return terms
}

/**
 * Check whether a page can take part in recommendations.
 *
 * 判断页面是否可以作为推荐来源或目标。
 *
 * @param page - Page to check / 要检查的页面
 * @param options - Theme options / 主题配置
 */
export function isRecommendablePage(
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>,
  options: ThemeOptions,
): boolean {
  // 公共内容页的通用规则（虚拟页面、隐藏、草稿、布局、加密）
  // Shared guard for public content pages.
  if (!isPublicContentPage(page, options))
    return false

  // 只推荐属于某个集合的页面
  return !!findCollection(page, options)
}

function toDoc(
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>,
  options: ResolvedRelatedPostsOptions,
): RelatedPostsDoc {
  const created = resolvePageCreateTime(page)

  return {
    page,
    path: page.path,
    // 使用原始标题，`page.data.title` 在 `extendsPage` 中被追加了集合标题
    title: page.title,
    tags: resolvePageTags(page),
    createTime: created?.getTime() ?? 0,
    createTimeText: created ? formatPostDate(created) : undefined,
    excerpt: resolveExcerpt(page, options),
  }
}

/**
 * Build the term vector of every document in a group.
 *
 * 为分组内的所有文档构建词项向量。
 *
 * Kept separate from {@link collectRelatedPostsGroups} so that a cached group can skip
 * tokenization entirely.
 *
 * 与 {@link collectRelatedPostsGroups} 分离，使命中缓存的分组可以完全跳过分词。
 *
 * @param group - Document group / 文档分组
 */
export function buildDocTerms(group: RelatedPostsGroup): ScorableRelatedPostsDoc[] {
  return group.docs.map((doc) => {
    doc.terms ??= resolveTerms(doc.page, group.options)
    return doc as ScorableRelatedPostsDoc
  })
}

/**
 * Collect and group all recommendable pages.
 *
 * 收集并分组所有可推荐的页面。
 *
 * @param pages - All pages of the app / 应用的全部页面
 * @param options - Theme options / 主题配置
 */
export function collectRelatedPostsGroups(
  pages: Page<ThemePageData>[],
  options: ThemeOptions,
): RelatedPostsGroup[] {
  const groups = new Map<string, RelatedPostsGroup>()

  for (const page of pages as Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>[]) {
    if (!isRecommendablePage(page, options))
      continue

    const collection = findCollection(page, options)!
    const locale = page.pathLocale
    const resolved = resolveCollectionRelatedPostsOptions(options, collection, locale)
    if (!resolved)
      continue

    const key = resolved.scope === 'locale'
      ? `${locale}::${collection.type}`
      : `${locale}::${collection.dir}`

    let group = groups.get(key)
    if (!group) {
      /**
       * `scope: 'locale'` 会把多个集合放进同一组，此时集合级配置无法同时成立，
       * 有主题级配置时统一退化为主题级配置。
       */
      const localeOption = getLocaleRelatedPostsOptions(options, locale)
      const groupOptions = resolved.scope === 'locale' && localeOption
        ? resolveOptionValue(localeOption) ?? resolved
        : resolved

      group = { key, options: groupOptions, docs: [] }
      groups.set(key, group)
    }

    group.docs.push(toDoc(page, group.options))
  }

  return [...groups.values()]
    .map(group => ({ ...group, docs: filterExcluded(group.docs, group.options.exclude) }))
    .filter(group => group.docs.length > 1)
}

function filterExcluded(docs: RelatedPostsDoc[], exclude: string[]): RelatedPostsDoc[] {
  if (!exclude.length)
    return docs

  const isExcluded = createMatcher(['**'], exclude)
  return docs.filter(doc => !isExcluded(doc.path))
}
