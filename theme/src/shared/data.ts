import type { LocaleConfig } from 'vuepress'
import type { BlogOptions, LastUpdatedOptions } from './features/index.js'
import type { ThemeLocale, ThemeLocaleDeprecated, ThemeLocaleText } from './locale.js'

export type ThemeLocaleData = ThemeLocale & ThemeLocaleDeprecated & ThemeLocaleText

/**
 * 主题注入到 客户端的数据
 */
export interface ThemeData extends ThemeBaseData, ThemeLocaleData {
  /**
   * 部署站点域名。
   * 用于生成 sitemap、 seo等。
   *
   */
  hostname?: string

  /**
   * 博客配置
   */
  blog?: false | Omit<BlogOptions, 'include' | 'exclude'>

  /**
   * 文章链接前缀
   *
   * @default '/article/'
   */
  article?: string

  /**
   * 是否显示 "编辑此页"
   *
   * @default true
   */
  editLink?: boolean

  /**
   * 最后更新时间
   *
   * @default { formatOptions: { dateStyle: 'short', timeStyle: 'short' } }
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * 是否显示贡献者
   */
  contributors?: boolean | { mode?: 'inline' | 'block' }

  /**
   * 是否显示页面更新日志
   */
  changelog?: boolean

  /**
   * 文档仓库配置, 用于生成 Edit this page 链接
   */
  docsRepo?: string

  /**
   * 文档仓库分支配置，用于生成 `Edit this page` 链接。
   */
  docsBranch?: string

  /**
   * 文档仓库目录配置，用于生成 `Edit this page` 链接。
   */
  docsDir?: string
}

export interface ThemeBaseData extends ThemeLocaleData {
  /**
   * 多语言配置
   */
  locales?: LocaleConfig<ThemeLocaleData>
}
