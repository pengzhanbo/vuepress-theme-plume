<script lang="ts" setup>
import { useElementVisibility } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'

declare const __MD_POWER_MARK_MODE__: 'lazy' | 'eager'

const mark = useTemplateRef('mark')
const active = ref(__MD_POWER_MARK_MODE__ === 'eager')

if (__MD_POWER_MARK_MODE__ === 'lazy') {
  const { isVisible, stop } = useElementVisibility(mark, {
    rootMargin: '-64px 0px 0px 0px',
    threshold: [0, 0.1, 0.25, 0.5],
    controls: true,
  })
  watch(isVisible, (value) => {
    if (value) {
      active.value = true
      stop()
    }
  }, { immediate: true })
}
</script>

<template>
  <mark ref="mark" class="vp-mark" :class="{ active }"><slot /></mark>
</template>
