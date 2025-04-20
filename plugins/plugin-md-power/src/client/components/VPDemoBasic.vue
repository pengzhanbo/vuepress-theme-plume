<script setup lang="ts">
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { useResizeObserver } from '@vueuse/core'
import { useTemplateRef, watch } from 'vue'
import { ClientOnly, onContentUpdated } from 'vuepress/client'
import { useExpand } from '../composables/demo.js'

import '@vuepress/helper/transition/fade-in-height-expand.css'
import '../styles/demo.css'

const props = defineProps<{
  type?: 'vue' | 'markdown'
  title?: string
  desc?: string
  expanded?: boolean
}>()

const [showCode, toggleCode] = useExpand(props.expanded)

const draw = useTemplateRef<HTMLIFrameElement>('draw')
const vueDraw = useTemplateRef<HTMLIFrameElement>('draw-vue')

function resizeAndPositionVueDraw() {
  if (!draw.value || !vueDraw.value)
    return
  const rect = draw.value.getBoundingClientRect()
  const { scrollLeft, scrollTop } = document.documentElement
  vueDraw.value.style.width = `${draw.value.offsetWidth - 48}px`
  vueDraw.value.style.top = `${rect.top + scrollTop}px`
  vueDraw.value.style.left = `${rect.x + scrollLeft}px`
}

if (props.type === 'vue' && !__VUEPRESS_SSR__) {
  watch([draw, vueDraw], () => {
    resizeAndPositionVueDraw()
    if (draw.value && vueDraw.value) {
      requestAnimationFrame(() => {
        draw.value!.style.height = `${vueDraw.value!.offsetHeight}px`
      })
    }
  }, { immediate: true })
  useResizeObserver(draw, resizeAndPositionVueDraw)
  useResizeObserver(() => document.body, resizeAndPositionVueDraw)
  onContentUpdated(resizeAndPositionVueDraw)

  useResizeObserver(vueDraw, () => {
    if (draw.value && vueDraw.value)
      draw.value.style.height = `${vueDraw.value.offsetHeight}px`
  })
}
</script>

<template>
  <div class="vp-demo-wrapper" :class="{ type }">
    <div ref="draw" class="demo-draw">
      <slot v-if="type !== 'vue'" />
      <ClientOnly v-else>
        <Teleport to="body">
          <div ref="draw-vue" class="demo-draw-vue">
            <slot />
          </div>
        </Teleport>
      </ClientOnly>
    </div>
    <div v-if="title || desc" class="demo-info">
      <p v-if="title" class="title">
        {{ title }}
      </p>
      <p v-if="desc" class="desc">
        {{ desc }}
      </p>
    </div>
    <div class="demo-ctrl">
      <button type="button" aria-label="Toggle Code" @click="toggleCode">
        <span class="vpi-demo-code" />
      </button>
    </div>
    <FadeInExpandTransition>
      <div v-show="showCode" class="demo-code">
        <slot name="code" />
      </div>
    </FadeInExpandTransition>
  </div>
</template>
