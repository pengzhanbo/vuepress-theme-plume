import type { App, ComputedRef, InjectionKey, Ref } from 'vue'
import type { ClientData, RouteLocale } from 'vuepress/client'
import type { ThemeData } from '../../shared/index.js'
import { themeData as themeDataRaw } from '@internal/themePlumeData'
import { computed, inject, ref } from 'vue'
import { clientDataSymbol } from 'vuepress/client'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

/**
 * Theme data reference type
 *
 * 主题数据引用类型
 */
export type ThemeDataRef<T extends ThemeData = ThemeData> = Ref<T>

/**
 * Theme locale data reference type
 *
 * 主题本地化数据引用类型
 */
export type ThemeLocaleDataRef<T extends ThemeData = ThemeData> = ComputedRef<T>

/**
 * Injection key for theme locale data
 *
 * 主题本地化数据的注入键
 */
export const themeLocaleDataSymbol: InjectionKey<ThemeLocaleDataRef> = Symbol(
  __VUEPRESS_DEV__ ? 'themeLocaleData' : '',
)

/**
 * Theme data ref
 * Global reference to the theme configuration data
 *
 * 主题数据引用
 * 主题配置数据的全局引用
 */
export const themeData: ThemeDataRef = ref(themeDataRaw)

/**
 * Use theme data
 * Returns the global theme data reference
 *
 * 获取主题数据
 * 返回全局主题数据引用
 *
 * @returns Theme data reference / 主题数据引用
 */
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

/**
 * Use theme locale data
 * Returns the theme data for the current route's locale
 *
 * 获取当前路由对应的语言环境的主题数据
 *
 * @returns Theme locale data computed reference / 主题本地化数据计算引用
 * @throws Error if called without provider / 如果没有提供者则抛出错误
 */
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
 * Merge the locales fields to the root fields according to the route path
 * Combines base theme options with locale-specific options
 *
 * 根据路由路径将本地化字段合并到根字段
 * 将基础主题选项与特定语言环境的选项合并
 *
 * @param theme - Base theme data / 基础主题数据
 * @param routeLocale - Current route locale / 当前路由的语言环境
 * @returns Merged theme data for the locale / 合并后的语言环境主题数据
 */
function resolveThemeLocaleData(theme: ThemeData, routeLocale: RouteLocale): ThemeData {
  const { locales, ...baseOptions } = theme

  return {
    ...baseOptions,
    ...locales?.[routeLocale],
  }
}

/**
 * Setup theme data for the Vue app
 * Provides theme data and theme locale data to the application
 *
 * 为 Vue 应用设置主题数据
 * 向应用程序提供主题数据和主题本地化数据
 *
 * @param app - Vue application instance / Vue 应用实例
 */
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
