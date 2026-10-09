import { computed, type ComputedRef, ref } from 'vue'

/**
 * 检查是否应该使用降级动画方案
 */
export function useReducedMotion(): ComputedRef<boolean> {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return computed(() => false)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const coarse = window.matchMedia('(pointer: coarse)')

  const isReduce = ref(reduce.matches)
  reduce.addEventListener('change', ev => isReduce.value = ev.matches)

  const isCoarse = coarse.matches

  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } }
  const cores = navigator.hardwareConcurrency

  return computed(() => {
    if (isReduce.value || connection?.saveData)
      return true

    return typeof cores === 'number' && cores > 0 && cores <= 4
      && isCoarse
  })
}
