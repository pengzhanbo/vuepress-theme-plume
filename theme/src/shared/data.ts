import type { LocaleConfig } from 'vuepress'
import type { LastUpdatedOptions } from './features/index.js'
import type { ThemeLocale, ThemeLocaleDeprecated, ThemeLocaleText } from './locale.js'

/**
 * Theme locale data type
 * Combines locale settings, deprecated options, and text translations
 *
 * 主题本地化数据类型
 * 组合本地化设置、弃用选项和文本翻译
 */
export type ThemeLocaleData = ThemeLocale & ThemeLocaleDeprecated & ThemeLocaleText

/**
 * Theme data injected to client
 * Contains all theme configuration options
 *
 * 主题注入到客户端的数据
 * 包含所有主题配置选项
 */
export interface ThemeData extends ThemeBaseData, ThemeLocaleData {
  /**
   * Deployment site hostname
   * Used for generating sitemap, SEO, etc.
   * 部署站点域名
   * 用于生成 sitemap、seo等
   */
  hostname?: string

  /**
   * Blog configuration
   * 博客配置
   * @deprecated
   */
  blog?: never

  /**
   * Article link prefix
   * 文章链接前缀
   * @default '/article/'
   * @deprecated
   */
  article?: string

  /**
   * Whether to show "Edit this page" link
   * 是否显示 "编辑此页"
   * @default true
   */
  editLink?: boolean

  /**
   * Last updated time configuration
   * 最后更新时间
   * @default { formatOptions: { dateStyle: 'short', timeStyle: 'short' } }
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * Whether to show contributors
   * 是否显示贡献者
   */
  contributors?: boolean | { mode?: 'inline' | 'block' }

  /**
   * Whether to show page changelog
   * 是否显示页面更新日志
   */
  changelog?: boolean

  /**
   * Documentation repository configuration for generating "Edit this page" link
   * 文档仓库配置, 用于生成 Edit this page 链接
   */
  docsRepo?: string

  /**
   * Documentation repository branch for generating "Edit this page" link
   * 文档仓库分支配置，用于生成 `Edit this page` 链接
   */
  docsBranch?: string

  /**
   * Documentation repository directory for generating "Edit this page" link
   * 文档仓库目录配置，用于生成 `Edit this page` 链接
   */
  docsDir?: string
}

/**
 * Base theme data with locale support
 * Provides foundation for multi-language theme configuration
 *
 * 支持多语言的基础主题数据
 * 为多语言主题配置提供基础
 */
export interface ThemeBaseData extends ThemeLocaleData {
  /**
   * Multi-language locale configuration
   * 多语言配置
   */
  locales?: LocaleConfig<ThemeLocaleData>
}
