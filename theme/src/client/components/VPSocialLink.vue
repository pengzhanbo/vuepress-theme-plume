<script lang="ts" setup>
import type { SocialLinkIcon } from '../../shared/index.js'
import VPIcon from '@theme/VPIcon.vue'
import { computed } from 'vue'
import { socialFallbacks } from '../composables/index.js'

const { icon, link, ariaLabel } = defineProps<{
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}>()

const iconName = computed(() => {
  if (typeof icon === 'string') {
    const name = socialFallbacks[icon] || icon
    if (name.includes(':'))
      return name
    return `simple-icons:${name}`
  }
  return icon
})

const label = computed(() => {
  if (ariaLabel)
    return ariaLabel
  if (typeof icon === 'string')
    return icon.includes(':') ? icon.split(':')[1] : icon
  return icon.name
})
</script>

<template>
  <a
    class="vp-social-link no-icon"
    :href="link"
    :aria-label="label"
    :title="label"
    target="_blank" rel="noopener"
  >
    <VPIcon :name="iconName" />
  </a>
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

.vp-social-link > :deep([class*="vpi-"]),
.vp-social-link > :deep(.vp-icon.is-svg) {
  width: 20px;
  height: 20px;
  fill: currentcolor;
}
</style>
