<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import NavBarMenuGroup from './NavBarMenuGroup.vue'
import NavBarMenuLink from './NavBarMenuLink.vue'

const { theme } = useData()
</script>

<template>
  <nav
    v-if="theme.navbar"
    aria-labelledby="main-nav-aria-label"
    class="navbar-menu"
  >
    <span id="main-nav-aria-label" class="visually-hidden">Main Navigation</span>
    <template v-for="item in theme.navbar" :key="item.text">
      <NavBarMenuLink v-if="'link' in item" :item="item" />
      <NavBarMenuGroup v-else :item="item" />
    </template>
  </nav>
</template>

<style scoped>
.navbar-menu {
  display: none;
}

@media (min-width: 768px) {
  .navbar-menu {
    display: flex;
  }
}
</style>
