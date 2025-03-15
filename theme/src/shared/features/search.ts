import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchPluginOptions } from '@vuepress/plugin-docsearch'

interface SearchBaseOptions {
  provider: 'local' | 'algolia'
}

export interface LocalSearchOptions extends SearchBaseOptions, SearchPluginOptions {
  provider: 'local'
}

export interface DocSearchOptions extends SearchBaseOptions, DocSearchPluginOptions {
  provider: 'algolia'
}

export type SearchOptions = LocalSearchOptions | DocSearchOptions
