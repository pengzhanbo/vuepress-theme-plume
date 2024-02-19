import type { LocaleConfig, Page } from 'vuepress/core'
import type { Options as MiniSearchOptions } from 'minisearch'

export type SearchBoxLocales = LocaleConfig<{
  placeholder: string
  buttonText: string
  resetButtonTitle: string
  backButtonTitle: string
  noResultsText: string
  footer: {
    selectText: string
    selectKeyAriaLabel: string
    navigateText: string
    navigateUpKeyAriaLabel: string
    navigateDownKeyAriaLabel: string
    closeText: string
    closeKeyAriaLabel: string
  }
}>

export interface SearchPluginOptions extends SearchOptions {
  locales?: SearchBoxLocales

  isSearchable?: (page: Page) => boolean

}

export interface SearchOptions {
  /**
   * @default false
   */
  disableQueryPersistence?: boolean

  miniSearch?: {
    /**
     * @see https://lucaong.github.io/minisearch/modules/_minisearch_.html#options
     */
    options?: Pick<
      MiniSearchOptions,
      'extractField' | 'tokenize' | 'processTerm'
    >
    /**
     * @see https://lucaong.github.io/minisearch/modules/_minisearch_.html#searchoptions-1
     */
    searchOptions?: MiniSearchOptions['searchOptions']
  }
}
