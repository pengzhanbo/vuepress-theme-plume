<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'

const props = defineProps<{
  type: 'link' | 'svg'
  name: string | { svg: string }
  color?: string
  size?: { width?: string, height?: string }
}>()

const svg = computed(() => {
  if (props.type === 'svg' && typeof props.name === 'object' && 'svg' in props.name) {
    return props.name.svg
  }
  return ''
})
const link = computed(() => {
  if (props.type === 'link') {
    const link = props.name as string
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
    class="vp-icon"
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
</style>
