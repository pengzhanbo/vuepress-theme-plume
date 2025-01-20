import type { SearchLocaleOptions } from '../../shared/index.js'

export const zhSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: '搜索文档',
  resetButtonTitle: '重置搜索',
  backButtonTitle: '关闭',
  noResultsText: '无搜索结果：',
  footer: {
    selectText: '选择',
    selectKeyAriaLabel: '输入',
    navigateText: '切换',
    navigateUpKeyAriaLabel: '向上',
    navigateDownKeyAriaLabel: '向下',
    closeText: '关闭',
    closeKeyAriaLabel: '退出',
  },
}
