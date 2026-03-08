/**
 * Traditional Chinese (Taiwan) locale configuration for search plugin.
 *
 * 搜索插件的繁体中文（台湾）本地化配置。
 *
 * @module plugin-search/node/locales/zh-tw
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * Traditional Chinese (Taiwan) search locale strings.
 *
 * 繁体中文（台湾）搜索本地化字符串。
 */
export const zhTwSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: '搜尋文件',
  resetButtonTitle: '重設搜尋',
  backButtonTitle: '關閉',
  noResultsText: '無搜尋結果：',
  footer: {
    selectText: '選擇',
    selectKeyAriaLabel: '輸入',
    navigateText: '切換',
    navigateUpKeyAriaLabel: '向上',
    navigateDownKeyAriaLabel: '向下',
    closeText: '關閉',
    closeKeyAriaLabel: '退出',
  },
}
