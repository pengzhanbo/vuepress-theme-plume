/** 日语 */
import type { SearchLocaleOptions } from '../../shared/index.js'

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
