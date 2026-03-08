/**
 * English locale configuration for search plugin.
 *
 * 搜索插件的英语本地化配置。
 *
 * @module plugin-search/node/locales/en
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * English search locale strings.
 *
 * 英语搜索本地化字符串。
 */
export const enSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'Search',
  resetButtonTitle: 'Reset search',
  backButtonTitle: 'Close search',
  noResultsText: 'No results for',
  footer: {
    selectText: 'to select',
    selectKeyAriaLabel: 'enter',
    navigateText: 'to navigate',
    navigateUpKeyAriaLabel: 'up arrow',
    navigateDownKeyAriaLabel: 'down arrow',
    closeText: 'to close',
    closeKeyAriaLabel: 'escape',
  },
}
