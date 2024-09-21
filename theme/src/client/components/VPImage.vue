<script lang="ts" setup>
import type { ThemeImage } from '../../shared/index.js'
import { withBase } from 'vuepress/client'

defineProps<{
  image: ThemeImage
  alt?: string
}>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <template v-if="image">
    <img
      v-if="typeof image === 'string' || 'src' in image"
      class="vp-image"
      v-bind="typeof image === 'string' ? $attrs : { ...image, ...$attrs }"
      :src="withBase(typeof image === 'string' ? image : image.src)"
      :alt="alt ?? (typeof image === 'string' ? '' : image.alt || '')"
    >
    <template v-else>
      <VPImage
        class="dark"
        :image="image.dark"
        :alt="image.alt"
        v-bind="$attrs"
      />
      <VPImage
        class="light"
        :image="image.light"
        :alt="image.alt"
        v-bind="$attrs"
      />
    </template>
  </template>
</template>

<style scoped>
html:not([data-theme="dark"]) .vp-image.dark {
  display: none;
}

[data-theme="dark"] .vp-image.light {
  display: none;
}
</style>
