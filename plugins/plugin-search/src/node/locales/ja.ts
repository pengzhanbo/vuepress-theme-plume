/**
 * Japanese locale configuration for search plugin.
 *
 * 搜索插件的日语本地化配置。
 *
 * @module plugin-search/node/locales/ja
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * Japanese search locale strings.
 *
 * 日语搜索本地化字符串。
 */
export const jaSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'ドキュメントを検索',
  resetButtonTitle: '検索をリセット',
  backButtonTitle: '閉じる',
  noResultsText: '検索結果がありません：',
  footer: {
    selectText: '選択',
    selectKeyAriaLabel: '入力',
    navigateText: '切り替え',
    navigateUpKeyAriaLabel: '上へ',
    navigateDownKeyAriaLabel: '下へ',
    closeText: '閉じる',
    closeKeyAriaLabel: '終了',
  },
}
