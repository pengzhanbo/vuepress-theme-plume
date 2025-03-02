<script setup lang="ts">
import { useDarkMode } from '@vuepress/helper/client'
import { computed } from 'vue'

const props = defineProps<{
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
  const middle = props.preview ? '/embed/preview/' : '/embed/'
  const params = new URLSearchParams()

  props.editable && params.set('editable', 'true')
  props.tab && params.set('default-tab', props.tab)

  const theme = props.theme ?? (isDark.value ? 'dark' : 'light')
  theme && params.set('theme-id', theme)

  return `${CODEPEN_LINK}${props.user}${middle}${props.slash}?${params.toString()}`
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
