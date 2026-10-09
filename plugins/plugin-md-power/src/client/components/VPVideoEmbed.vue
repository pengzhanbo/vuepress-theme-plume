<script setup lang="ts">
import EmbedFrame from './EmbedFrame.vue'

defineOptions({
  inheritAttrs: false,
})

const { src, title, type, width, height, ratio } = defineProps<{
  src: string
  title: string
  type?: string
  width?: string
  height?: string
  ratio?: string
}>()

const IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture'
</script>

<template>
  <EmbedFrame
    class="video-iframe" :class="type"
    :src="src"
    :title="title || type"
    :width="width"
    :height="height"
    :ratio="ratio"
    :allow="IFRAME_ALLOW"
    v-bind="$attrs"
  />
</template>

<style>
.video-iframe {
  margin: 16px auto;
  border: none;
  border-radius: 5px;
}
</style>
