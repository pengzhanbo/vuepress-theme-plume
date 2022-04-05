import type { CanIUsePluginOptions } from '@vuepress-plume/vuepress-plugin-caniuse'
import type { DocsearchOptions } from '@vuepress/plugin-docsearch'
import type { SearchPluginOptions } from '@vuepress/plugin-search'
export interface PlumeThemePluginOptions {
  /**
   * 是否启用 can-i-use 插件
   */
  caniuse?: CanIUsePluginOptions

  /**
   * 是否启用 external-link-icon 插件
   */
  externalLinkIcon?: boolean

  /**
   * plugin-search 配置
   */
  search?: Partial<SearchPluginOptions>

  /**
   * plugin-docsearch 配置
   */
  docsearch?: Partial<DocsearchOptions>

  prismjs?: boolean

  nprogress?: boolean

  mediumZoom?: boolean

  toc?: boolean
}
