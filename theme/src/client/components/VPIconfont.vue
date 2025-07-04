<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: { width?: string, height?: string }
  color?: string
  prefix?: string
}>()

const prefix = computed(() => props.prefix || 'iconfont icon-')
</script>

<template>
  <i
    class="vp-icon"
    :class="`${prefix}${name}`"
    :style="{ color, 'font-size': size?.height || '1em' }"
    data-provider="iconfont"
    aria-hidden
  />
</template>
