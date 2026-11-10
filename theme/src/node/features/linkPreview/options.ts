import type { LinkPreviewOptions, ThemeOptions } from '../../../shared/index.js'
import { clampInteger, createMatcher } from '../../utils/index.js'

/**
 * Options with every default applied at build time.
 *
 * 构建期已应用全部默认值的配置（只保留影响数据的字段）。
 *
 * Presentation-only options (`delay` / `selector` / `maxWidth` / `focusDelay`) are
 * read on the client, they are intentionally not normalized here.
 *
 * 展示型配置（`delay` / `selector` / `maxWidth` / `focusDelay`）只在客户端使用，
 * 不参与构建期归一化，避免两份默认值互相牵制。
 */
export interface ResolvedLinkPreviewOptions {
  /**
   * Whether to write the excerpt
   *
   * 是否写入摘要
   */
  showExcerpt: boolean
  /**
   * Max excerpt length
   *
   * 摘要最大字符数
   */
  excerptLength: number
  /**
   * Whether to write the headings
   *
   * 是否写入标题结构
   */
  showHeadings: boolean
  /**
   * Max headings
   *
   * 标题数量上限
   */
  headingsLimit: number
  /**
   * Whether to write the tags
   *
   * 是否写入标签
   */
  showTags: boolean
  /**
   * Whether to write the updated time
   *
   * 是否写入更新时间
   */
  showUpdatedTime: boolean
  /**
   * Matcher of the excluded target paths, `null` when not configured
   *
   * 目标路径排除器，未配置时为 `null`
   */
  excludeMatcher: ((path: string) => boolean) | null
}

/**
 * Normalize the link preview options of one locale.
 *
 * 归一化某个语言环境的内链预览配置。
 *
 * @param options - Raw options / 原始配置
 */
export function normalizeLinkPreviewOptions(options: LinkPreviewOptions): ResolvedLinkPreviewOptions {
  const isIncluded = options.exclude?.length
    ? createMatcher(['**'], options.exclude)
    : null

  return {
    showExcerpt: options.showExcerpt ?? true,
    excerptLength: clampInteger(options.excerptLength ?? 120, 0, 300),
    showHeadings: options.showHeadings ?? false,
    headingsLimit: clampInteger(options.headingsLimit ?? 3, 1, 6),
    showTags: options.showTags ?? true,
    showUpdatedTime: options.showUpdatedTime ?? true,
    excludeMatcher: isIncluded ? path => !isIncluded(path) : null,
  }
}

/**
 * Resolve the effective options of one page's locale.
 *
 * 读取某页实际生效的配置：语言级优先于主题级；`false` / 未配置 → `null`
 * （该页不生成预览数据）。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function resolveLocaleLinkPreviewOptions(
  options: ThemeOptions,
  locale: string,
): ResolvedLinkPreviewOptions | null {
  // locale 级的 `false` 会覆盖主题级配置 / A locale level `false` wins
  const value = options.locales?.[locale]?.linkPreview ?? options.linkPreview
  if (!value)
    return null

  return normalizeLinkPreviewOptions(value === true ? {} : value)
}
