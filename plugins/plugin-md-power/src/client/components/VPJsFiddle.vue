<script setup lang="ts">
import { useDarkMode } from '@vuepress/helper/client'
import { computed } from 'vue'
import EmbedFrame from './EmbedFrame.vue'

defineOptions({
  inheritAttrs: false,
})

const { source, title, tab, theme, width, height } = defineProps<{
  source: string
  title?: string
  tab: string
  theme?: 'light' | 'dark'
  width?: string
  height?: string
}>()

const isDark = useDarkMode()

const link = computed(() => {
  const themeMode = theme === 'dark' ? '/dark/' : isDark.value ? '/dark/' : ''
  return `https://jsfiddle.net/${source}/embedded/${tab}${themeMode}`
})
</script>

<template>
  <EmbedFrame
    class="js-fiddle-iframe"
    :src="link"
    :title="title"
    :width="width"
    :height="height"
    allowfullscreen
    v-bind="$attrs"
  />
</template>

<style>
.js-fiddle-iframe {
  margin: 16px auto;
  border: none;
  box-shadow: var(--vp-shadow-2);
}
</style>
