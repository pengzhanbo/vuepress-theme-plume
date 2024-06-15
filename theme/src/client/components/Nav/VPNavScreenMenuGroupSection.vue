<script lang="ts" setup>
import type { NavItemWithLink } from '../../../shared/index.js'
import VPIcon from '../VPIcon.vue'
import VPNavScreenMenuGroupLink from './VPNavScreenMenuGroupLink.vue'

defineProps<{
  icon?: string | { svg: string }
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
      :text="item.text"
      :link="item.link"
      :icon="item.icon"
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
