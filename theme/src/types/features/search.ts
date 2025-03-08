import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchPluginOptions } from '@vuepress/plugin-docsearch'

export interface LocalSearchOptions extends SearchPluginOptions {
  provider: 'local'
}

export interface DocSearchOptions extends DocSearchPluginOptions {
  provider: 'algolia'
}

export type SearchOptions = LocalSearchOptions | DocSearchOptions
