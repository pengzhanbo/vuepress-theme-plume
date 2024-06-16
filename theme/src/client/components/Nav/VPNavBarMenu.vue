<script lang="ts" setup>
import VPNavBarMenuGroup from '@theme/Nav/VPNavBarMenuGroup.vue'
import VPNavBarMenuLink from '@theme/Nav/VPNavBarMenuLink.vue'
import { useData } from '../../composables/data.js'

const { theme } = useData()
</script>

<template>
  <nav
    v-if="theme.navbar"
    aria-labelledby="main-nav-aria-label"
    class="vp-navbar-menu"
  >
    <span id="main-nav-aria-label" class="visually-hidden">Main Navigation</span>
    <template v-for="item in theme.navbar" :key="item.text">
      <VPNavBarMenuLink v-if="'link' in item" :item="item" />
      <VPNavBarMenuGroup v-else :item="item" />
    </template>
  </nav>
</template>

<style scoped>
.vp-navbar-menu {
  display: none;
}

@media (min-width: 768px) {
  .vp-navbar-menu {
    display: flex;
  }
}
</style>
