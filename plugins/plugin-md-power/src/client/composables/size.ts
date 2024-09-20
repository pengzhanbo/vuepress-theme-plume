/**
 * Fork for https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/packages/components/src/client/composables/useSize.ts
 *
 * The MIT License (MIT)
 * Copyright (C) 2021 - PRESENT by Mr.Hope<mister-hope@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import type { MaybeRef } from '@vueuse/core'
import type { Ref, ShallowRef, ToRefs } from 'vue'
import type { SizeOptions } from '../../shared/index.js'
import { useEventListener } from '@vueuse/core'
import { computed, isRef, onMounted, ref, shallowRef, toValue, watch } from 'vue'

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

function getRadio(ratio: number | string | undefined): number {
  if (typeof ratio === 'string') {
    const [width, height] = ratio.split(':')
    const parsedRadio = Number(width) / Number(height)

    if (!Number.isNaN(parsedRadio))
      return parsedRadio
  }

  return typeof ratio === 'number' ? ratio : 16 / 9
}
