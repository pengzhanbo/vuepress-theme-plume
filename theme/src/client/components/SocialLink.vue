<script lang="ts" setup>
import { computed } from 'vue'
import type { SocialLinkIcon } from '../../shared/index.js'

const props = defineProps<{
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}>()

const svg = computed(() => {
  if (typeof props.icon === 'object')
    return props.icon.svg
  return `<span class="vpi-social-${props.icon}" />`
})
</script>

<template>
  <a
    class="social-link"
    :href="link"
    :aria-label="ariaLabel ?? (typeof icon === 'string' ? icon : '')"
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

.social-link > :deep(svg),
.social-link > :deep([class^="vpi-social-"]) {
  width: 20px;
  height: 20px;
  fill: currentcolor;
}
</style>
