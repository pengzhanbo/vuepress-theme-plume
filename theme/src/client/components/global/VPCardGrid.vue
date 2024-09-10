<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { onMounted, ref, toValue, watch } from 'vue'

const props = defineProps<{
  cols?: string | number | { sm?: number, md?: number, lg?: number }
}>()

const md = useMediaQuery('(min-width: 768px)')
const lg = useMediaQuery('(min-width: 960px)')
const repeat = ref(1)

function resolveCols() {
  const reset = { sm: 1, md: 2, lg: 2 }
  if (!props.cols)
    return reset
  if (typeof props.cols === 'number' || typeof props.cols === 'string') {
    const cols = Number(props.cols)
    return { sm: cols, md: cols, lg: cols }
  }
  return { ...reset, ...toValue(props.cols) }
}

function getRepeat() {
  const cols = resolveCols()
  if (lg.value)
    return cols.lg
  if (md.value)
    return cols.md
  return cols.sm
}

watch(() => [md.value, lg.value, props.cols], () => {
  repeat.value = getRepeat()
})

onMounted(() => {
  repeat.value = getRepeat()
})
</script>

<template>
  <div class="vp-card-grid" :class="[`cols-${repeat}`]" :style="{ gridTemplateColumns: `repeat(${repeat}, 1fr)` }">
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
