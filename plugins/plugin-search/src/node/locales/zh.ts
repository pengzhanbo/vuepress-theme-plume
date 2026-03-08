/**
 * Simplified Chinese locale configuration for search plugin.
 *
 * 搜索插件的简体中文本地化配置。
 *
 * @module plugin-search/node/locales/zh
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * Simplified Chinese search locale strings.
 *
 * 简体中文搜索本地化字符串。
 */
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
