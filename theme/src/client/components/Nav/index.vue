<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import { computed, provide } from 'vue'
import type { PlumeThemePageData } from '../../../shared/index.js'
import { useNav } from '../../composables/nav.js'
import Navbar from './NavBar.vue'
import NavScreen from './NavScreen.vue'

const page = usePageData<PlumeThemePageData>()

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
  top: var(--vp-layout-top-height, 0px);
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-nav);
  width: 100%;
  pointer-events: none;
  transition: background-color 0.5s;
}

.nav-wrapper.fixed {
  position: fixed;
}

.nav-wrapper.fixed :deep(.navbar-wrapper) {
  border-bottom-color: var(--vp-c-gutter);
  background-color: var(--vp-nav-bg-color);
}

@media (min-width: 960px) {
  .nav-wrapper {
    position: fixed;
  }
}
</style>
