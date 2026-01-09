<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'

defineOptions({
  inheritAttrs: false,
})

const { type, name, color, size } = defineProps<{
  type: 'link' | 'svg'
  name: string | { svg: string }
  color?: string
  size?: { width?: string, height?: string }
}>()

const svg = computed(() => {
  if (type === 'svg' && typeof name === 'object' && 'svg' in name) {
    return name.svg
  }
  return ''
})
const link = computed(() => {
  if (type === 'link') {
    const link = name as string
    return isLinkHttp(link) ? link : withBase(link)
  }
  return ''
})
</script>

<template>
  <span v-if="type === 'link'" class="vp-icon-img" aria-hidden>
    <img :src="link" alt="" :style="{ height: size?.height }">
  </span>
  <span
    v-else-if="type === 'svg'"
    class="vp-icon is-svg"
    :style="{ color, ...size }"
    aria-hidden
    v-html="svg"
  />
</template>

<style scoped>
.vp-icon-img {
  display: inline-block;
  width: max-content;
  height: 1em;
  margin: 0 0.3em;
  vertical-align: middle;
}

.vp-icon-img img {
  height: 100%;
}

.vp-icon.is-svg :deep(svg) {
  width: inherit;
  height: inherit;
}
</style>
