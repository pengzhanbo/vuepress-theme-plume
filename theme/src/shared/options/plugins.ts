import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { ShikiPluginOptions } from '@vuepress-plume/plugin-shikiji'
import type { CommentPluginOptions } from '@vuepress/plugin-comment'
import type { DocSearchOptions } from '@vuepress/plugin-docsearch'
import type { MarkdownImagePluginOptions } from '@vuepress/plugin-markdown-image'
import type { MarkdownIncludePluginOptions } from '@vuepress/plugin-markdown-include'
import type { MarkdownMathPluginOptions } from '@vuepress/plugin-markdown-math'
import type { ReadingTimePluginOptions } from '@vuepress/plugin-reading-time'
import type { SeoPluginOptions } from '@vuepress/plugin-seo'
import type { SitemapPluginOptions } from '@vuepress/plugin-sitemap'
import type { WatermarkPluginOptions } from '@vuepress/plugin-watermark'
import type { MarkdownEnhancePluginOptions } from 'vuepress-plugin-md-enhance'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'

export interface PlumeThemePluginOptions {
  /**
   * plugin-search 配置
   */
  search?: false | Partial<SearchPluginOptions>

  /**
   * plugin-docsearch 配置
   */
  docsearch?: false | DocSearchOptions

  /**
   * 代码高亮 配置
   */
  shiki?: false | ShikiPluginOptions

  /**
   * git 插件 配置
   */
  git?: boolean

  nprogress?: false

  photoSwipe?: false

  /**
   * 是否启用 `vuepress-plugin-md-enhance` 插件
   *
   * - `hint`, `alert` 已迁移至 `@vuepress/plugin-markdown-hint`, 且主题内置并默认启用。
   * - `imgSize`, `imgMark`, `imgLazyload`, `figure`, `obsidianImgSize` 已迁移至 `@vuepress/plugin-markdown-image`, 请使用 `plugins.markdownImage` 配置项代替。
   * - `katex`, `mathjax` 已迁移至 `@vuepress/plugin-markdown-math`, 请使用 `plugins.markdownMath` 配置项代替
   */
  markdownEnhance?: false | MarkdownEnhancePluginOptions

  markdownPower?: false | MarkdownPowerPluginOptions

  /**
   * 是否启用 `@vuepress/plugin-markdown-image` 插件
   *
   * @default false
   * @see https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html
   */
  markdownImage?: false | MarkdownImagePluginOptions

  /**
   * 是否启用 `@vuepress/plugin-markdown-math` 插件
   *
   * @default { type: 'katex' }
   * @see https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html
   */
  markdownMath?: false | MarkdownMathPluginOptions

  /**
   * 是否启用 `@vuepress/plugin-markdown-include` 插件
   *
   * @default true
   *
   * @see https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-include.html
   */
  markdownInclude?: boolean | MarkdownIncludePluginOptions

  comment?: false | CommentPluginOptions

  sitemap?: false | Omit<SitemapPluginOptions, 'hostname'> & { hostname?: string }

  seo?: false | Omit<SeoPluginOptions, 'hostname'> & { hostname?: string }

  /**
   * 阅读时间、字数统计
   */
  readingTime?: false | ReadingTimePluginOptions

  /**
   * 是否开启 水印
   */
  watermark?: boolean | (WatermarkPluginOptions & { fullPage?: boolean })
}
