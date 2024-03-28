import type { MaybeRef } from '@vueuse/core'
import { useEventListener } from '@vueuse/core'
import type { Ref, ShallowRef, ToRefs } from 'vue'
import { computed, isRef, onMounted, ref, shallowRef, toValue, watch } from 'vue'
import type { SizeOptions } from '../../shared/size.js'

export interface SizeInfo<T extends HTMLElement> {
  el: ShallowRef<T | undefined>
  width: Ref<string>
  height: Ref<string>
  resize: () => void
}
export function useSize<T extends HTMLElement>(
  options: ToRefs<SizeOptions>,
  extraHeight: MaybeRef<number> = 0,
): SizeInfo<T> {
  const el = shallowRef<T>()
  const width = computed(() => toValue(options.width) || '100%')
  const height = ref('auto')

  const getRadio = (ratio: number | string | undefined): number => {
    if (typeof ratio === 'string') {
      const [width, height] = ratio.split(':')
      const parsedRadio = Number(width) / Number(height)

      if (!Number.isNaN(parsedRadio))
        return parsedRadio
    }

    return typeof ratio === 'number' ? ratio : 16 / 9
  }

  const getHeight = (width: number): string => {
    const height = toValue(options.height)
    const ratio = getRadio(toValue(options.ratio))

    return height || `${Number(width) / ratio + toValue(extraHeight)}px`
  }

  const resize = (): void => {
    if (el.value)
      height.value = getHeight(el.value.offsetWidth)
  }

  onMounted(() => {
    resize()
    if (isRef(extraHeight))
      watch(extraHeight, resize)

    useEventListener('orientationchange', resize)
    useEventListener('resize', resize)
  })

  return { el, width, height, resize }
}
