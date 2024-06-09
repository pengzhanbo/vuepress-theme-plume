<script lang="ts" setup>
import { computed, provide } from 'vue'
import { useNav } from '../../composables/nav.js'
import { useData } from '../../composables/data.js'
import Navbar from './NavBar.vue'
import NavScreen from './NavScreen.vue'

const { page } = useData()

const { isScreenOpen, closeScreen, toggleScreen } = useNav()

const fixedInclude = ['blog', 'friends', 'blog-archives', 'blog-tags']

const fixed = computed(() => {
  return fixedInclude.includes(page.value.frontmatter.type as string)
})

provide('close-screen', closeScreen)
</script>

<template>
  <div class="nav-wrapper" :class="{ fixed }">
    <Navbar :is-screen-open="isScreenOpen" @toggle-screen="toggleScreen" />
    <NavScreen :open="isScreenOpen" />
  </div>
</template>

<style scoped>
.nav-wrapper {
  position: relative;
  top: var(--vp-layout-top-height, 0);

  /* rtl:ignore */
  left: 0;
  z-index: var(--vp-z-index-nav);
  width: 100%;
  pointer-events: none;
}

.nav-wrapper.fixed {
  position: fixed;
}

.nav-wrapper.fixed :deep(.navbar-wrapper) {
  background-color: var(--vp-nav-bg-color);
  border-bottom-color: var(--vp-c-gutter);
}

@media (min-width: 960px) {
  .nav-wrapper {
    position: fixed;
  }
}
</style>
