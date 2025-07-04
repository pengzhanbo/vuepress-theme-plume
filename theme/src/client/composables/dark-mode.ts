import type { App, InjectionKey, Ref } from 'vue'
import { useDark, useEventListener } from '@vueuse/core'
import { inject, ref } from 'vue'
import { useThemeData } from './theme-data.js'

type DarkModeRef = Ref<boolean>

export const darkModeSymbol: InjectionKey<DarkModeRef> = Symbol(
  __VUEPRESS_DEV__ ? 'darkMode' : '',
)

export function enableTransitions(): boolean {
  if (typeof document === 'undefined')
    return false
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

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
 * Inject dark mode global computed
 */
export function useDarkMode(): DarkModeRef {
  const isDarkMode = inject(darkModeSymbol)
  if (!isDarkMode)
    throw new Error('useDarkMode() is called without provider.')

  return isDarkMode
}
