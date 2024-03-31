<script setup lang="ts">
import { toRefs } from 'vue'
import { useSize } from '../composables/size.js'

const props = defineProps<{
  src: string
  title: string
  width?: string
  height?: string
  ratio?: string
}>()

const IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture'

const options = toRefs(props)

const { el, width, height, resize } = useSize(options)
</script>

<template>
  <ClientOnly>
    <iframe
      ref="el"
      class="video-youtube-iframe"
      :src="src"
      :title="title || 'Youtube'"
      :style="{ width, height }"
      :allow="IFRAME_ALLOW"
      @load="resize"
    />
  </ClientOnly>
</template>

<style>
.video-youtube-iframe {
  width: 100%;
  margin: 16px auto;
  border: none;
  border-radius: 5px;
}
</style>
