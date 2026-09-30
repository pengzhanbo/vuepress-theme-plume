/**
 * Shared Types for VuePress Search Plugin
 *
 * VuePress 搜索插件的共享类型
 *
 * This module contains type definitions shared between the node and client
 * sides of the search plugin.
 *
 * 本模块包含搜索插件在 Node 端和客户端之间共享的类型定义。
 *
 * @module plugin-search/shared
 */
import type { Options as MiniSearchOptions } from 'minisearch'
import type { LocaleConfig, Page } from 'vuepress/core'

/**
 * Locale options for search UI strings.
 *
 * 搜索 UI 字符串的语言选项。
 */
export interface SearchLocaleOptions {
  /** Placeholder text for search input / 搜索输入框的占位文本 */
  placeholder: string
  /** Text for search button / 搜索按钮的文本 */
  buttonText: string
  /** Title for reset button / 重置按钮的标题 */
  resetButtonTitle: string
  /** Title for back/close button / 返回/关闭按钮的标题 */
  backButtonTitle: string
  /** Text shown when no results found / 无搜索结果时显示的文本 */
  noResultsText: string
  /**
   * Text shown when the search index is missing or fails to load.
   *
   * 搜索索引缺失或加载失败时显示的文本。
   */
  searchIndexErrorText?: string
  /** Footer keyboard shortcut hints / 底部键盘快捷键提示 */
  footer: {
    /** Text for select action / 选择操作的文本 */
    selectText: string
    /** ARIA label for select key / 选择键的 ARIA 标签 */
    selectKeyAriaLabel: string
    /** Text for navigate action / 导航操作的文本 */
    navigateText: string
    /** ARIA label for navigate up key / 向上导航键的 ARIA 标签 */
    navigateUpKeyAriaLabel: string
    /** ARIA label for navigate down key / 向下导航键的 ARIA 标签 */
    navigateDownKeyAriaLabel: string
    /** Text for close action / 关闭操作的文本 */
    closeText: string
    /** ARIA label for close key / 关闭键的 ARIA 标签 */
    closeKeyAriaLabel: string
  }
}

/**
 * Locale configuration type for search box.
 *
 * 搜索框的语言配置类型。
 */
export type SearchBoxLocales = LocaleConfig<SearchLocaleOptions>

/**
 * Create a tokenizer shared by the node (index build) and client (query) sides.
 *
 * 创建由 Node 端（构建索引）与客户端（查询）共享的分词器。
 *
 * MiniSearch requires the tokenizer used to build the index to be identical to
 * the one used at query time. Defining it in one place guarantees both sides
 * use the same strategy: `Intl.Segmenter` when available, otherwise the same
 * deterministic whitespace fallback.
 *
 * MiniSearch 要求构建索引与查询时使用完全一致的分词器。集中定义可保证两端策略一致：
 * 支持 `Intl.Segmenter` 时使用它分词，否则统一退化为确定性的空白符分词。
 *
 * @param lang - Language code for word segmentation / 用于分词的语言代码
 * @returns Tokenizer that splits a string into tokens / 将字符串切分为词元的函数
 * @example
 * const tokenize = createTokenizer('en')
 * tokenize('Hello world') // ['Hello', ' ', 'world'] with Intl.Segmenter
 */
export function createTokenizer(lang: string): (text: string) => string[] {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
    return text => Array.from(segmenter.segment(text)).map(segment => segment.segment)
  }
  return text => text.split(/\s+/).filter(Boolean)
}

/**
 * Options for the search plugin.
 *
 * 搜索插件的选项。
 */
export interface SearchPluginOptions extends SearchOptions {
  /** Locale-specific search configurations / 特定语言的搜索配置 */
  locales?: SearchBoxLocales

  /**
   * Function to determine if a page should be indexed.
   *
   * 判断页面是否应被索引的函数。
   *
   * @param page - VuePress page object / VuePress 页面对象
   * @returns Whether the page should be searchable / 页面是否可搜索
   */
  isSearchable?: (page: Page) => boolean

}

/**
 * Search configuration options.
 *
 * 搜索配置选项。
 */
export interface SearchOptions {
  /**
   * Whether to disable query persistence in session storage.
   *
   * 是否禁用会话存储中的查询持久化。
   *
   * @default false
   */
  disableQueryPersistence?: boolean

  /**
   * MiniSearch configuration options.
   *
   * MiniSearch 配置选项。
   */
  miniSearch?: {
    /**
     * MiniSearch instance options.
     *
     * MiniSearch 实例选项。
     *
     * @see https://lucaong.github.io/minisearch/modules/_minisearch_.html#options
     */
    options?: Pick<
      MiniSearchOptions,
      'extractField' | 'tokenize' | 'processTerm'
    >
    /**
     * MiniSearch search options.
     *
     * MiniSearch 搜索选项。
     *
     * @see https://lucaong.github.io/minisearch/modules/_minisearch_.html#searchoptions-1
     */
    searchOptions?: MiniSearchOptions['searchOptions']
  }
}
