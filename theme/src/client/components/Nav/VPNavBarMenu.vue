<script lang="ts" setup>
import VPNavBarMenuGroup from '@theme/Nav/VPNavBarMenuGroup.vue'
import VPNavBarMenuLink from '@theme/Nav/VPNavBarMenuLink.vue'
import { useNavbarData } from '../../composables/index.js'

const navbar = useNavbarData()
</script>

<template>
  <nav
    v-if="navbar.length"
    aria-labelledby="main-nav-aria-label"
    class="vp-navbar-menu"
  >
    <span id="main-nav-aria-label" class="visually-hidden">Main Navigation</span>
    <template v-for="item in navbar" :key="item.text">
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
