<script lang="ts" setup>
import type { NavItemWithLink } from '../../../shared/index.js'
import NavScreenMenuGroupLink from './NavScreenMenuGroupLink.vue'

defineProps<{
  text?: string
  items: NavItemWithLink[]
}>()
</script>

<template>
  <div class="nav-screen-menu-group-section">
    <p v-if="text" class="title">{{ text }}</p>
    <NavScreenMenuGroupLink
      v-for="item in items"
      :key="item.text"
      :text="item.text"
      :link="item.link"
    />
  </div>
</template>

<style scoped>
.nav-screen-menu-group-section {
  display: block;
}

.title {
  line-height: 32px;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}
</style>
