/**
 * Locale Composable for Search Plugin
 *
 * 搜索插件的语言组合式函数
 *
 * @module plugin-search/client/composables/locale
 */
import type { ComputedRef, MaybeRef } from 'vue'
import type { SearchBoxLocales, SearchLocaleOptions } from '../../shared/index.js'
import { computed, toRef } from 'vue'
import { useRouteLocale } from 'vuepress/client'

/**
 * Default locale configuration for search.
 *
 * 搜索的默认语言配置。
 */
const defaultLocales: SearchBoxLocales = {
  '/': {
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

/**
 * Get locale configuration for the current route.
 *
 * 获取当前路由的语言配置。
 *
 * @param locales - Locale configuration object / 语言配置对象
 * @returns Computed ref to the current locale settings / 当前语言设置的计算引用
 * @example
 * const locale = useLocale(locales)
 * console.log(locale.value.placeholder) // 'Search' or localized value
 */
export function useLocale(locales: MaybeRef<SearchBoxLocales>): ComputedRef<Partial<SearchLocaleOptions>> {
  const localesRef = toRef(locales)
  const routeLocale = useRouteLocale()

  const locale = computed(() => localesRef.value[routeLocale.value] ?? defaultLocales[routeLocale.value] ?? defaultLocales['/'])

  return locale
}
