import type { App, ComputedRef, InjectionKey, Ref } from 'vue'
import type { PlumeThemeData } from '../../shared/index.js'
import { themeData as themeDataRaw } from '@internal/themePlumeData'
import { computed, inject, ref } from 'vue'
import { type ClientData, clientDataSymbol, type RouteLocale } from 'vuepress/client'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

export type ThemeDataRef<T extends PlumeThemeData = PlumeThemeData> = Ref<T>

export type ThemeLocaleDataRef<T extends PlumeThemeData = PlumeThemeData> = ComputedRef<T>

export const themeLocaleDataSymbol: InjectionKey<ThemeLocaleDataRef> = Symbol(
  __VUEPRESS_DEV__ ? 'themeLocaleData' : '',
)

export const themeData: ThemeDataRef = ref(themeDataRaw)

export function useThemeData<
  T extends PlumeThemeData = PlumeThemeData,
>(): ThemeDataRef<T> {
  return themeData as ThemeDataRef<T>
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateThemeData = (data: PlumeThemeData) => {
    themeData.value = data
  }
}

export function useThemeLocaleData<
  T extends PlumeThemeData = PlumeThemeData,
>(): ThemeLocaleDataRef<T> {
  const themeLocaleData = inject(themeLocaleDataSymbol)
  if (!themeLocaleData) {
    throw new Error('useThemeLocaleData() is called without provider.')
  }
  return themeLocaleData as ThemeLocaleDataRef<T>
}

/**
 * Merge the locales fields to the root fields
 * according to the route path
 */
function resolveThemeLocaleData(theme: PlumeThemeData, routeLocale: RouteLocale): PlumeThemeData {
  const { locales, ...baseOptions } = theme

  return {
    ...baseOptions,
    ...locales?.[routeLocale],
  }
}

export function setupThemeData(app: App) {
  // provide theme data & theme locale data
  const themeData = useThemeData()
  const clientData: ClientData
    = app._context.provides[clientDataSymbol as unknown as symbol]
  const themeLocaleData = computed(() =>
    resolveThemeLocaleData(themeData.value, clientData.routeLocale.value),
  )
  app.provide(themeLocaleDataSymbol, themeLocaleData)

  Object.defineProperties(app.config.globalProperties, {
    $theme: {
      get() {
        return themeData.value
      },
    },
    $themeLocale: {
      get() {
        return themeLocaleData.value
      },
    },
  })
}
