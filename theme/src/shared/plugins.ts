import type { Prettify } from '@pengzhanbo/utils'
import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { CachePluginOptions } from '@vuepress/plugin-cache'
import type { CommentPluginOptions } from '@vuepress/plugin-comment'
import type { CopyCodePluginOptions } from '@vuepress/plugin-copy-code'
import type { DocSearchOptions } from '@vuepress/plugin-docsearch'
import type { LlmsPluginOptions } from '@vuepress/plugin-llms'
import type { MarkdownChartPluginOptions } from '@vuepress/plugin-markdown-chart'
import type { MarkdownImagePluginOptions } from '@vuepress/plugin-markdown-image'
import type { MarkdownIncludePluginOptions } from '@vuepress/plugin-markdown-include'
import type { MarkdownMathPluginOptions } from '@vuepress/plugin-markdown-math'
import type { PhotoSwipePluginOptions } from '@vuepress/plugin-photo-swipe'
import type { ReadingTimePluginOptions } from '@vuepress/plugin-reading-time'
import type { ReplaceAssetsPluginOptions } from '@vuepress/plugin-replace-assets'
import type { SeoPluginOptions } from '@vuepress/plugin-seo'
import type { ShikiPluginOptions } from '@vuepress/plugin-shiki'
import type { SitemapPluginOptions } from '@vuepress/plugin-sitemap'
import type { WatermarkPluginOptions } from '@vuepress/plugin-watermark'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'

export interface ThemeBuiltinPlugins {
  /**
   * plugin-search 配置
   */
  search?: false | Partial<SearchPluginOptions>

  /**
   * plugin-docsearch 配置
   */
  docsearch?: false | DocSearchOptions

  /**
   * 代码块复制按钮配置
   */
  copyCode?: false | CopyCodePluginOptions

  /**
   * 代码高亮 配置
   */
  shiki?: false | ShikiPluginOptions

  /**
   * git 插件 配置
   */
  git?: boolean

  /**
   * 页面加载进度插件
   */
  nprogress?: false

  /**
   * 图片预览 插件
   */
  photoSwipe?: false | PhotoSwipePluginOptions

  /**
   * @deprecated 插件相关功能已迁移至其他官方插件，此插件已弃用
   */
  markdownEnhance?: never

  /**
   * 是否启用 `vuepress-plugin-md-power` 插件
   */
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

  /**
   * 是否启用 `@vuepress/plugin-markdown-chart` 插件
   *
   * @default false
   *
   * @see https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/
   */
  markdownChart?: false | MarkdownChartPluginOptions

  /**
   * 评论插件
   */
  comment?: false | CommentPluginOptions

  /**
   * 生成站点地图
   */
  sitemap?: false | Prettify<Omit<SitemapPluginOptions, 'hostname'> & { hostname?: string }>

  /**
   * SEO
   */
  seo?: false | Prettify<Omit<SeoPluginOptions, 'hostname'> & { hostname?: string }>

  /**
   * 缓存
   */
  cache?: false | CachePluginOptions

  /**
   * 阅读时间、字数统计
   */
  readingTime?: false | ReadingTimePluginOptions

  /**
   * 是否开启 水印
   */
  watermark?: boolean | Prettify<WatermarkPluginOptions & { fullPage?: boolean }>

  /**
   * 资源链接替换
   */
  replaceAssets?: false | ReplaceAssetsPluginOptions

  /**
   * llmstxt 配置
   */
  llmstxt?: boolean | LlmsPluginOptions
}
