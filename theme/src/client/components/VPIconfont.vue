<script setup lang="ts">
const { name, size, color, prefix } = defineProps<{
  name: string
  size?: { width?: string, height?: string }
  color?: string
  prefix?: string
}>()
</script>

<template>
  <i
    class="vp-icon"
    :class="`${prefix || 'iconfont icon-'}${name}`"
    :style="{ color, 'font-size': size?.height || '1em' }"
    data-provider="iconfont"
    aria-hidden
  />
</template>
