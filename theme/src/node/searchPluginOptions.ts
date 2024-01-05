import type { DocsearchPluginOptions } from '@vuepress/plugin-docsearch'
import type { SearchPluginOptions } from '@vuepress/plugin-search'
import type { App } from '@vuepress/core'
import { deepMerge } from '@pengzhanbo/utils'

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
  'zh-CN': { placeholder: '搜索' },
  'en-US': { placeholder: 'Search' },
}

export function resolvedDocsearchOption(app: App, options: DocsearchPluginOptions): DocsearchPluginOptions {
  options.locales ??= {}

  Object.keys(app.siteData.locales || {}).forEach((locale) => {
    const lang = app.siteData.locales![locale]?.lang || 'en-US'
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

  Object.keys(app.siteData.locales || {}).forEach((locale) => {
    const lang = app.siteData.locales![locale]?.lang || 'en-US'
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
