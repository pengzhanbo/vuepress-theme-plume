import type { App, ComputedRef, InjectionKey, Ref } from 'vue'
import type { ClientData, RouteLocale } from 'vuepress/client'
import type { ThemeData } from '../../shared/index.js'
import { themeData as themeDataRaw } from '@internal/themePlumeData'
import { computed, inject, ref } from 'vue'
import { clientDataSymbol } from 'vuepress/client'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

export type ThemeDataRef<T extends ThemeData = ThemeData> = Ref<T>

export type ThemeLocaleDataRef<T extends ThemeData = ThemeData> = ComputedRef<T>

export const themeLocaleDataSymbol: InjectionKey<ThemeLocaleDataRef> = Symbol(
  __VUEPRESS_DEV__ ? 'themeLocaleData' : '',
)

export const themeData: ThemeDataRef = ref(themeDataRaw)

export function useThemeData<
  T extends ThemeData = ThemeData,
>(): ThemeDataRef<T> {
  return themeData as ThemeDataRef<T>
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateThemeData = (data: ThemeData) => {
    themeData.value = data
  }
}

export function useThemeLocaleData<
  T extends ThemeData = ThemeData,
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
function resolveThemeLocaleData(theme: ThemeData, routeLocale: RouteLocale): ThemeData {
  const { locales, ...baseOptions } = theme

  return {
    ...baseOptions,
    ...locales?.[routeLocale],
  }
}

export function setupThemeData(app: App): void {
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
