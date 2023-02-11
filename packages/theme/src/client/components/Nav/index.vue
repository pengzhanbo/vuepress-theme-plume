<script lang="ts" setup>
import { provide } from 'vue'
import { useNav } from '../../composables/nav.js'
import Navbar from './NavBar.vue'
import NavScreen from './NavScreen.vue'

const { isScreenOpen, closeScreen, toggleScreen } = useNav()

provide('close-screen', closeScreen)
</script>
<template>
  <div class="nav-wrapper">
    <Navbar :is-screen-open="isScreenOpen" @toggle-screen="toggleScreen" />
    <NavScreen :open="isScreenOpen" />
  </div>
</template>

<style scoped>
.nav-wrapper {
  position: relative;
  top: var(--vp-layout-top-height, 0px);
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-nav);
  width: 100%;
  pointer-events: none;
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .nav-wrapper {
    position: fixed;
  }
}
</style>
