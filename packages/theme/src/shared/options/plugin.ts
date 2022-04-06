import type { CanIUsePluginOptions } from '@vuepress-plume/vuepress-plugin-caniuse'
import type { DocsearchOptions } from '@vuepress/plugin-docsearch'
import type { SearchPluginOptions } from '@vuepress/plugin-search'
import type { CopyCodeOptions } from 'vuepress-plugin-copy-code2'
import type { MarkdownEnhanceOptions } from 'vuepress-plugin-md-enhance'
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
  docsearch?: false | Partial<DocsearchOptions>

  prismjs?: false

  nprogress?: false

  mediumZoom?: false

  copyCode?: false | CopyCodeOptions

  markdownEnhance?: false | MarkdownEnhanceOptions
}
