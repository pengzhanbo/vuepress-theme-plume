import type { App, InjectionKey, Ref } from 'vue'
import { useDark, useEventListener } from '@vueuse/core'
import { inject, ref } from 'vue'
import { useThemeData } from './theme-data.js'

/**
 * Dark mode reference type
 *
 * 暗黑模式引用类型
 */
type DarkModeRef = Ref<boolean>

/**
 * Injection key for dark mode
 *
 * 暗黑模式的注入键
 */
export const darkModeSymbol: InjectionKey<DarkModeRef> = Symbol(
  __VUEPRESS_DEV__ ? 'darkMode' : '',
)

/**
 * Check if view transitions are enabled and supported
 * Considers prefers-reduced-motion preference
 *
 * 检查视图过渡是否启用且受支持
 * 考虑 prefers-reduced-motion 偏好设置
 *
 * @returns Whether transitions are enabled / 过渡是否启用
 */
export function enableTransitions(): boolean {
  if (typeof document === 'undefined')
    return false
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

/**
 * Setup dark mode for the Vue application
 * Configures dark mode based on theme settings and user preferences
 *
 * 为 Vue 应用设置暗黑模式
 * 根据主题设置和用户偏好配置暗黑模式
 *
 * @param app - Vue application instance / Vue 应用实例
 */
export function setupDarkMode(app: App): void {
  const theme = useThemeData()

  const transition = theme.value.transition
  const disableTransition = enableTransitions() || (typeof transition === 'object'
    ? transition.appearance === false
    : transition === false)

  const appearance = theme.value.appearance
  const isDark
    = appearance === 'force-dark'
      ? ref(true)
      : appearance
        ? useDark({
            storageKey: 'vuepress-theme-appearance',
            attribute: 'data-theme',
            valueLight: 'light',
            valueDark: 'dark',
            disableTransition,
            initialValue: () =>
              typeof appearance === 'string' ? appearance : 'auto',
            ...(typeof appearance === 'object' ? appearance : {}),
          })
        : ref(false)

  app.provide(darkModeSymbol, isDark)

  if (__VUEPRESS_DEV__ && appearance === 'force-dark' && typeof document !== 'undefined') {
    document.documentElement.dataset.theme = 'dark'
  }

  Object.defineProperty(app.config.globalProperties, '$isDark', {
    get: () => isDark,
  })

  // Handle print events - switch to light mode for printing
  useEventListener('beforeprint', () => {
    if (isDark.value)
      document.documentElement.dataset.theme = 'light'
  })

  useEventListener('afterprint', () => {
    if (isDark.value)
      document.documentElement.dataset.theme = 'dark'
  })
}

/**
 * Use dark mode
 * Returns the dark mode reactive reference
 *
 * 获取暗黑模式状态
 *
 * @returns Dark mode reference / 暗黑模式引用
 * @throws Error if called without provider / 如果没有提供者则抛出错误
 */
export function useDarkMode(): DarkModeRef {
  const isDarkMode = inject(darkModeSymbol)
  if (!isDarkMode)
    throw new Error('useDarkMode() is called without provider.')

  return isDarkMode
}
