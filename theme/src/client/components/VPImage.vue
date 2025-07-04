<script lang="ts" setup>
import type { ThemeImage } from '../../shared/index.js'
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { numToUnit } from '../utils/index.js'

const props = defineProps<{
  image: ThemeImage
  alt?: string
}>()

const styles = computed(() => {
  const image = props.image
  if (!image || typeof image === 'string')
    return ''
  if (!image.width || !image.height)
    return ''
  return {
    width: numToUnit(image.width),
    height: numToUnit(image.height),
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
} as { inheritAttrs: boolean }
</script>

<template>
  <template v-if="image">
    <img
      v-if="typeof image === 'string' || 'src' in image"
      class="vp-image"
      :style="styles"
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
