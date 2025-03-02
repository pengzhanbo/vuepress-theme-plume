<script setup lang="ts">
import { useDarkMode } from '@vuepress/helper/client'
import { computed } from 'vue'

const props = defineProps<{
  source: string
  title?: string
  tab: string
  theme?: 'light' | 'dark'
  width?: string
  height?: string
}>()

const isDark = useDarkMode()

const link = computed(() => {
  const theme = props.theme === 'dark' ? '/dark/' : isDark.value ? '/dark/' : ''
  return `https://jsfiddle.net/${props.source}/embedded/${props.tab}${theme}`
})
</script>

<template>
  <iframe
    class="js-fiddle-iframe"
    :src="link"
    :title="title"
    :style="{ width, height }"
    frameborder="0"
    allowfullscreen="true"
    allowpaymentrequest="true"
  />
</template>

<style>
.js-fiddle-iframe {
  margin: 16px auto;
  border: none;
  box-shadow: var(--vp-shadow-2);
}
</style>
