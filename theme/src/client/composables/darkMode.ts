import { inject, onMounted, provide, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export type DarkModeRef = Ref<boolean>

export const darkModeSymbol: InjectionKey<DarkModeRef> = Symbol(
  __VUEPRESS_DEV__ ? 'darkMode' : ''
)

/**
 * Inject dark mode global computed
 */
export const useDarkMode = (): DarkModeRef => {
  const isDark = inject(darkModeSymbol)
  if (isDark === undefined) {
    throw new Error('useDarkMode() is called without provider.')
  }
  return isDark
}

/**
 * Create dark mode ref and provide as global computed in setup
 */
export const setupDarkMode = (): void => {
  const isDark = ref<boolean>(false)
  onMounted(() => {
    if (document.documentElement.classList.contains('dark')) {
      isDark.value = true
    }
  })
  provide(darkModeSymbol, isDark)
}
