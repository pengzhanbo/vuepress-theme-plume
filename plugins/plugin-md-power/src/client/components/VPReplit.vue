<script setup lang="ts">
import type { ReplitTokenMeta } from '../../shared/index.js'
import { useDarkMode } from '@vuepress/helper/client'
import { computed } from 'vue'
import EmbedFrame from './EmbedFrame.vue'

defineOptions({
  inheritAttrs: false,
})

const { source, theme, width, height, title } = defineProps<ReplitTokenMeta>()

const REPLIT_LINK = 'https://replit.com/'

const isDark = useDarkMode()

const link = computed(() => {
  const url = new URL(`/${source}`, REPLIT_LINK)
  url.searchParams.set('embed', 'true')

  const themeMode = theme || (isDark.value ? 'dark' : 'light')
  url.searchParams.set('theme', themeMode)

  return url.toString()
})
</script>

<template>
  <EmbedFrame
    class="replit-iframe-wrapper"
    :src="link"
    :title="title || 'Replit'"
    :width="width"
    :height="height"
    allowtransparency
    allowfullscreen
    v-bind="$attrs"
  />
</template>

<style>
.replit-iframe-wrapper {
  margin: 16px auto;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  transition: border 0.25s;
}
</style>
