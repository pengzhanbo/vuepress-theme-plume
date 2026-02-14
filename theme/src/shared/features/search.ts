import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchPluginOptions } from '@vuepress/plugin-docsearch'

/**
 * Base search options
 *
 * 基础搜索选项
 */
interface SearchBaseOptions {
  /** Search provider / 搜索提供者 */
  provider: 'local' | 'algolia'
}

/**
 * Local search options
 *
 * 本地搜索选项
 */
export interface LocalSearchOptions extends SearchBaseOptions, SearchPluginOptions {
  provider: 'local'
}

/**
 * Algolia DocSearch options
 *
 * Algolia DocSearch 选项
 */
export interface DocSearchOptions extends SearchBaseOptions, DocSearchPluginOptions {
  provider: 'algolia'
}

/**
 * Search options (union type)
 *
 * 搜索选项（联合类型）
 */
export type SearchOptions = LocalSearchOptions | DocSearchOptions
