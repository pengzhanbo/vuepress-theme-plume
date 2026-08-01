<script setup lang="ts">
import { useDarkMode } from '@vuepress/helper/client'
import { useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue'

interface MessageData {
  type: string
  payload?: {
    feature?: string
    meta?: string
    height: number
  }
}

const { feature, past = 2, future = 1, meta = '', baseline = false } = defineProps<{
  feature: string
  past?: number
  future?: number
  meta?: string
  baseline?: boolean
}>()

const url = 'https://caniuse.pengzhanbo.cn/'

const height = ref(baseline ? '150px' : '350px')

const isDark = useDarkMode()
const source = computed(() => {
  const source = `${url}${feature}${baseline ? '/baseline#' : `#past=${past}&future=${future}&`}meta=${meta}&theme=${isDark.value ? 'dark' : 'light'}`

  return source
})

useEventListener('message', (event) => {
  const data = parseData(event.data)
  const { type, payload } = data
  if (
    type === 'ciu-embed'
    && payload
    && payload.feature === feature
    && payload.meta === meta
  ) {
    height.value = `${Math.ceil(payload.height)}px`
  }
})

function parseData(data: string | MessageData): MessageData {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    }
    catch {
      return { type: '' }
    }
  }
  return data
}
</script>

<template>
  <div class="ciu_embed" :class="{ baseline }">
    <iframe :src="source" :style="{ height }" :title="`Can I use ${feature}`" />
  </div>
</template>

<style>
.ciu_embed {
  margin: 16px -24px;
}

.ciu_embed.baseline {
  overflow: hidden;
  border-radius: 8px;
}

.ciu_embed iframe {
  width: 100%;
  border: none;
}

@media (min-width: 768px) {
  .ciu_embed {
    margin: 16px 0;
  }
}
</style>
