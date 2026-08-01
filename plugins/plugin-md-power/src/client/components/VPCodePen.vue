<script setup lang="ts">
import { useDarkMode } from '@vuepress/helper/client'
import { computed } from 'vue'

const { user, slash, title, preview, editable, tab, theme, width, height } = defineProps<{
  user: string
  slash: string
  title?: string
  preview?: boolean
  editable?: boolean
  tab?: string
  theme?: 'light' | 'dark'
  width?: string
  height?: string
}>()

const CODEPEN_LINK = 'https://codepen.io/'

const isDark = useDarkMode()

const link = computed(() => {
  const middle = preview ? '/embed/preview/' : '/embed/'
  const params = new URLSearchParams()

  editable && params.set('editable', 'true')
  tab && params.set('default-tab', tab)

  const themeMode = theme ?? (isDark.value ? 'dark' : 'light')
  themeMode && params.set('theme-id', themeMode)

  return `${CODEPEN_LINK}${user}${middle}${slash}?${params.toString()}`
})
</script>

<template>
  <iframe
    :src="link"
    class="code-pen-iframe"
    :title="title"
    :style="{ width, height }"
    frameborder="0"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
  />
</template>

<style>
.code-pen-iframe {
  margin: 16px auto;
  border: none;
  box-shadow: var(--vp-shadow-2);
}
</style>
