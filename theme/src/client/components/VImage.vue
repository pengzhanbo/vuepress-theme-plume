<script lang="ts" setup>
import { withBase } from 'vuepress/client'

defineProps<{
  image:
    | string
    | { src: string, alt?: string }
    | { dark: string, light: string, alt?: string }
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
      class="plume-image"
      v-bind="typeof image === 'string' ? $attrs : { ...image, ...$attrs }"
      :src="withBase(typeof image === 'string' ? image : image.src)"
      :alt="alt ?? (typeof image === 'string' ? '' : image.alt || '')"
    >
    <template v-else>
      <VImage
        class="dark"
        :image="image.dark"
        :alt="image.alt"
        v-bind="$attrs"
      />
      <VImage
        class="light"
        :image="image.light"
        :alt="image.alt"
        v-bind="$attrs"
      />
    </template>
  </template>
</template>

<style scoped>
html:not(.dark) .plume-image.dark {
  display: none;
}

.dark .plume-image.light {
  display: none;
}
</style>
