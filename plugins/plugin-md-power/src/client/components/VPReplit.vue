<script setup lang="ts">
import type { ReplitTokenMeta } from '../../shared/index.js'
import { useDarkMode } from '@vuepress/helper/client'
import { computed, ref } from 'vue'
import Loading from './icons/Loading.vue'

defineOptions({
  inheritAttrs: false,
})

const { source, theme, width, height: h, title } = defineProps<ReplitTokenMeta>()

// magic height
const height = ref('47px')
const loaded = ref(false)

const REPLIT_LINK = 'https://replit.com/'

const isDark = useDarkMode()

const link = computed(() => {
  const url = new URL(`/${source}`, REPLIT_LINK)
  url.searchParams.set('embed', 'true')

  const themeMode = theme || (isDark.value ? 'dark' : 'light')
  url.searchParams.set('theme', themeMode)

  return url.toString()
})

function onload() {
  loaded.value = true
  height.value = h || '450px'
}
</script>

<template>
  <ClientOnly>
    <iframe
      class="replit-iframe-wrapper"
      :src="link"
      :title="title || 'Replit'"
      :style="{ width, height }"
      v-bind="$attrs"
      allowtransparency="true"
      allowfullscree="true"
      @load="onload"
    />
    <Loading v-if="!loaded" />
  </ClientOnly>
</template>

<style>
.replit-iframe-wrapper {
  width: 100%;
  margin: 16px auto;
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  transition: border 0.25s;
}
</style>
