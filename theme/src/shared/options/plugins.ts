import type { DocsearchOptions } from '@vuepress/plugin-docsearch'
import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { AutoFrontmatterOptions } from '@vuepress-plume/plugin-auto-frontmatter'
import type { BaiduTongjiOptions } from '@vuepress-plume/plugin-baidu-tongji'
import type { CopyCodeOptions } from '@vuepress-plume/plugin-copy-code'
import type { ShikiPluginOptions } from '@vuepress-plume/plugin-shikiji'
import type { CommentPluginOptions } from '@vuepress/plugin-comment'
import type { MarkdownEnhancePluginOptions } from 'vuepress-plugin-md-enhance'
import type { ReadingTimePluginOptions } from '@vuepress/plugin-reading-time'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'
import type { WatermarkPluginOptions } from '@vuepress/plugin-watermark'

export interface PlumeThemePluginOptions {
  /**
   * @deprecated 迁移至 `plugin-md-power` 插件
   *
   * 是否启用 can-i-use 插件
   */
  caniuse?: false

  /**
   * 是否启用 external-link-icon 插件
   */
  externalLinkIcon?: false

  /**
   * plugin-search 配置
   */
  search?: false | Partial<SearchPluginOptions>

  /**
   * plugin-docsearch 配置
   */
  docsearch?: false | DocsearchOptions

  /**
   * @deprecated move to `shiki`
   * 代码高亮 配置
   */
  shikiji?: false | ShikiPluginOptions

  /**
   * 代码高亮 配置
   */
  shiki?: false | ShikiPluginOptions

  /**
   * git 插件 配置
   */
  git?: false

  nprogress?: false

  mediumZoom?: false

  copyCode?: false | CopyCodeOptions

  markdownEnhance?: false | MarkdownEnhancePluginOptions

  markdownPower?: false | MarkdownPowerPluginOptions

  comment?: false | CommentPluginOptions

  sitemap?: false

  seo?: false

  baiduTongji?: false | BaiduTongjiOptions

  frontmatter?: Omit<AutoFrontmatterOptions, 'frontmatter'>

  readingTime?: false | ReadingTimePluginOptions

  /**
   * 是否开启 水印
   */
  watermark?: boolean | (WatermarkPluginOptions & { fullPage?: boolean })
}
