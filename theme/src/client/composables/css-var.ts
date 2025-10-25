import { computed, type ComputedRef, type MaybeRefOrGetter, shallowRef, toValue, watch } from 'vue'
import { useDarkMode } from './dark-mode.js'

/**
 * Get css variable
 * @param prop css variable name
 * @param initialValue
 */
export function useCssVar(
  prop: MaybeRefOrGetter<string | null | undefined>,
  initialValue = '',
): ComputedRef<string | null | undefined> {
  const isDark = useDarkMode()
  const variable = shallowRef(initialValue)

  function updateCssVar() {
    const _window = typeof window ? window : null
    const target = _window?.document?.documentElement
    const key = toValue(prop)
    if (target && key) {
      const value = _window.getComputedStyle(target).getPropertyValue(key)?.trim()
      variable.value = value || variable.value || initialValue
    }
  }

  watch([isDark, () => toValue(prop)], () => {
    updateCssVar()
  }, { immediate: true, flush: 'post' })

  return computed(() => variable.value)
}
