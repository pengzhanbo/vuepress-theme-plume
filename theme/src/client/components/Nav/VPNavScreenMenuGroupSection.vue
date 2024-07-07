<script lang="ts" setup>
import VPIcon from '@theme/VPIcon.vue'
import VPNavScreenMenuGroupLink from '@theme/Nav/VPNavScreenMenuGroupLink.vue'
import type { NavItemWithLink, ThemeIcon } from '../../../shared/index.js'

defineProps<{
  icon?: ThemeIcon
  text?: string
  items: NavItemWithLink[]
}>()
</script>

<template>
  <div class="vp-nav-screen-menu-group-section">
    <p v-if="text" class="title">
      <VPIcon v-if="icon" :name="icon" />
      {{ text }}
    </p>
    <VPNavScreenMenuGroupLink
      v-for="item in items"
      :key="item.text"
      :item="item"
    />
  </div>
</template>

<style scoped>
.vp-nav-screen-menu-group-section {
  display: block;
}

.title {
  font-size: 13px;
  font-weight: 700;
  line-height: 32px;
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}
</style>
