<script lang="ts" setup>
import { useElementVisibility } from '@vueuse/core'
import { useTemplateRef } from 'vue'

declare const __MD_POWER_MARK_MODE__: 'lazy' | 'eager'

const mark = useTemplateRef('mark')
const active = __MD_POWER_MARK_MODE__ === 'lazy'
  ? useElementVisibility(mark, { rootMargin: '-64px 0px 0px 0px', threshold: [0, 0.1, 0.25, 0.5] })
  : true
</script>

<template>
  <mark ref="mark" class="vp-mark" :class="{ active }"><slot /></mark>
</template>
