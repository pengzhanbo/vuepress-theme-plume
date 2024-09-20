import type { MaybeRef } from 'vue'
import type { SearchBoxLocales } from '../../shared/index.js'
import { computed, toRef } from 'vue'
import { useRouteLocale } from 'vuepress/client'

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

export function useLocale(locales: MaybeRef<SearchBoxLocales>) {
  const localesRef = toRef(locales)
  const routeLocale = useRouteLocale()

  const locale = computed(() => localesRef.value[routeLocale.value] ?? defaultLocales[routeLocale.value] ?? defaultLocales['/'])

  return locale
}
