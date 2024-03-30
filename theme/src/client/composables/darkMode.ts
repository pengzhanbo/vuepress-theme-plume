import { inject, onMounted, ref } from 'vue'
import type { App, InjectionKey, Ref } from 'vue'

export type DarkModeRef = Ref<boolean>

export const darkModeSymbol: InjectionKey<DarkModeRef> = Symbol(
  __VUEPRESS_DEV__ ? 'darkMode' : '',
)

/**
 * Inject dark mode global computed
 */
export function useDarkMode(): DarkModeRef {
  const isDark = inject(darkModeSymbol)
  if (isDark === undefined)
    throw new Error('useDarkMode() is called without provider.')

  return isDark
}

/**
 * Create dark mode ref and provide as global computed in setup
 */
export function setupDarkMode(): void {
  const isDark = useDarkMode()
  onMounted(() => {
    if (document.documentElement.classList.contains('dark'))
      isDark.value = true
  })
}

export function injectDarkMode(app: App): void {
  const isDark = ref<boolean>(false)
  app.provide(darkModeSymbol, isDark)

  Object.defineProperty(app.config.globalProperties, '$isDark', {
    get: () => isDark,
  })
}
