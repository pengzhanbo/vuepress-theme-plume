<script setup lang="ts">
import type { ReplitTokenMeta } from '../../shared/index.js'
import { useDarkMode } from '@vuepress/helper/client'
import { computed, ref } from 'vue'
import Loading from './icons/Loading.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ReplitTokenMeta>()

// magic height
const height = ref('47px')
const loaded = ref(false)

const REPLIT_LINK = 'https://replit.com/'

const isDark = useDarkMode()

const link = computed(() => {
  const url = new URL(`/${props.source}`, REPLIT_LINK)
  url.searchParams.set('embed', 'true')

  const theme = props.theme || (isDark.value ? 'dark' : 'light')
  url.searchParams.set('theme', theme)

  return url.toString()
})

function onload() {
  loaded.value = true
  height.value = props.height || '450px'
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
