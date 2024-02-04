<script lang="ts" setup>
import { computed } from 'vue'
import type { SocialLinkIcon } from '../../shared/index.js'
import { icons } from '../utils/index.js'

const props = defineProps<{
  icon: SocialLinkIcon
  link: string
}>()

const svg = computed(() => {
  if (typeof props.icon === 'object')
    return props.icon.svg
  return icons[props.icon]
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <a
    class="social-link"
    :href="link"
    target="_blank"
    rel="noopener"
    v-html="svg"
  />
</template>

<style scoped>
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}

.social-link:hover {
  color: var(--vp-c-text-1);
}

.social-link > :deep(svg) {
  width: 20px;
  height: 20px;
  fill: currentcolor;
}
</style>
