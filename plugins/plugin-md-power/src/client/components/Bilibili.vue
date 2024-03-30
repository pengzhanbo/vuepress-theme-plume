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

function onLoad() {
  resize()
}
</script>

<template>
  <ClientOnly>
    <iframe
      ref="el"
      class="video_bilibili_iframe"
      :src="src"
      :title="title || 'Bilibili'"
      :style="{ width, height }"
      :allow="IFRAME_ALLOW"
      @load="onLoad"
    />
  </ClientOnly>
</template>

<style>
.video_bilibili_iframe {
  width: 100%;
  margin: 16px auto;
  border: none;
  border-radius: 5px;
}
</style>
