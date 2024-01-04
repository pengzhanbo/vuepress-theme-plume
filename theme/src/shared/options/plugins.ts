import type { DocsearchOptions } from '@vuepress/plugin-docsearch'
import type { SearchPluginOptions } from '@vuepress/plugin-search'
import type { AutoFrontmatterOptions } from '@vuepress-plume/plugin-auto-frontmatter'
import type { BaiduTongjiOptions } from '@vuepress-plume/plugin-baidu-tongji'
import type { CanIUsePluginOptions } from '@vuepress-plume/plugin-caniuse'
import type { CopyCodeOptions } from '@vuepress-plume/plugin-copy-code'
import type { ShikijiPluginOptions } from '@vuepress-plume/plugin-shikiji'
import type { CommentPluginOptions } from 'vuepress-plugin-comment2'
import type { MarkdownEnhanceOptions } from 'vuepress-plugin-md-enhance'
import type { ReadingTimeOptions } from 'vuepress-plugin-reading-time2'

export interface PlumeThemePluginOptions {
  /**
   * 是否启用 can-i-use 插件
   */
  caniuse?: false | CanIUsePluginOptions

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
   * 代码高亮 配置
   */
  shikiji?: false | ShikijiPluginOptions

  /**
   * git 插件 配置
   */
  git?: false

  nprogress?: false

  mediumZoom?: false

  copyCode?: false | CopyCodeOptions

  markdownEnhance?: false | MarkdownEnhanceOptions

  comment?: false | CommentPluginOptions

  sitemap?: false

  seo?: false

  baiduTongji?: false | BaiduTongjiOptions

  frontmatter?: Omit<AutoFrontmatterOptions, 'frontmatter'>

  readingTime?: false | ReadingTimeOptions
}
