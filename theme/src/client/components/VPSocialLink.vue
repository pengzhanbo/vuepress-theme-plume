<script lang="ts" setup>
import type { SocialLinkIcon } from '../../shared/index.js'
import { computed } from 'vue'

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
    class="vp-social-link no-icon"
    :href="link"
    :aria-label="ariaLabel ?? (typeof icon === 'string' ? icon : '')"
    target="_blank" rel="noopener" v-html="svg"
  />
</template>

<style scoped>
.vp-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-social-link:hover {
  color: var(--vp-c-text-1);
}

.vp-social-link > :deep(svg),
.vp-social-link > :deep([class^="vpi-social-"]) {
  width: 20px;
  height: 20px;
  fill: currentcolor;
}
</style>
