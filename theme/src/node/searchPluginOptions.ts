import type { DocsearchPluginOptions } from '@vuepress/plugin-docsearch'
import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { App } from 'vuepress/core'
import { deepMerge } from '@pengzhanbo/utils'
import { resolvedAppLocales } from './resolveLocaleOptions.js'

// `en-US` is used by default
const defaultDocsearchLocales: NonNullable<DocsearchPluginOptions['locales']> = {
  'zh-CN': {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档',
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消',
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除',
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接',
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者',
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈',
        },
      },
    },
  },
}

const defaultSearchLocales: NonNullable<SearchPluginOptions['locales']> = {
  'zh-CN': {
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
  },
  'en-US': {
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
  },
}

export function resolvedDocsearchOption(app: App, options: DocsearchPluginOptions): DocsearchPluginOptions {
  options.locales ??= {}

  const locales = resolvedAppLocales(app)
  Object.keys(locales).forEach((locale) => {
    const lang = locales[locale]?.lang || 'en-US'
    if (defaultDocsearchLocales[lang]) {
      options.locales![locale] = deepMerge(
        {},
        defaultDocsearchLocales[lang],
        options.locales![locale] || {},
      )
    }
  })

  return options
}

export function resolvedSearchOptions(app: App, options: SearchPluginOptions = {}): SearchPluginOptions {
  options.locales ??= {}
  const locales = resolvedAppLocales(app)
  Object.keys(locales).forEach((locale) => {
    const lang = locales[locale]?.lang || 'en-US'
    if (defaultSearchLocales[lang]) {
      options.locales![locale] = deepMerge(
        {},
        defaultSearchLocales[lang],
        options.locales![locale] || {},
      )
    }
  })

  return options
}
