<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps<{
  cols?: string | number | { sm?: number, md?: number, lg?: number }
}>()

const md = useMediaQuery('(min-width: 768px)')
const lg = useMediaQuery('(min-width: 960px)')

const cols = computed(() => {
  const reset = { sm: 1, md: 2, lg: 2 }
  if (!props.cols)
    return reset
  if (typeof props.cols === 'number' || typeof props.cols === 'string') {
    const cols = Number(props.cols)
    return { sm: cols, md: cols, lg: cols }
  }
  return { ...reset, ...props.cols }
})

const repeat = computed(() => {
  if (lg.value)
    return cols.value.lg
  else if (md.value)
    return cols.value.md
  else
    return cols.value.sm
})
</script>

<template>
  <div
    class="vp-card-grid" :class="[`cols-${repeat}`]" :style="{
      gridTemplateColumns: `repeat(${repeat}, 1fr)`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.vp-card-grid {
  display: grid;
  gap: 16px 20px;
  margin: 16px 0;
}

.vp-card-grid > * {
  margin: 0 !important;
}
</style>
