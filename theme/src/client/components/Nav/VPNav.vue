<script lang="ts" setup>
import VPNavbar from '@theme/Nav/VPNavBar.vue'
import VPNavScreen from '@theme/Nav/VPNavScreen.vue'
import { computed, provide, watchEffect } from 'vue'
import { useData, useNav } from '../../composables/index.js'
import { inBrowser } from '../../utils/index.js'

const { page, frontmatter } = useData()

const { isScreenOpen, closeScreen, toggleScreen } = useNav()

const fixedInclude = ['posts', 'friends', 'posts-archives', 'posts-tags', 'posts-categories']

const fixed = computed(() => {
  return fixedInclude.includes(page.value.type as string)
})

const hasNavbar = computed(() => {
  return frontmatter.value.navbar !== false
})

provide('close-screen', closeScreen)

watchEffect(() => {
  if (inBrowser) {
    document.documentElement.classList.toggle('hide-nav', !hasNavbar.value)
  }
})
</script>

<template>
  <header v-if="hasNavbar" class="vp-nav" :class="{ fixed }">
    <VPNavbar :is-screen-open="isScreenOpen" @toggle-screen="toggleScreen">
      <template #nav-bar-title-before>
        <slot name="nav-bar-title-before" />
      </template>
      <template #nav-bar-title-after>
        <slot name="nav-bar-title-after" />
      </template>
      <template #nav-bar-content-before>
        <slot name="nav-bar-content-before" />
      </template>
      <template #nav-bar-content-after>
        <slot name="nav-bar-content-after" />
      </template>
      <template #nav-bar-menu-before>
        <slot name="nav-bar-menu-before" />
      </template>
      <template #nav-bar-menu-after>
        <slot name="nav-bar-menu-after" />
      </template>
    </VPNavbar>

    <VPNavScreen :open="isScreenOpen">
      <template #nav-screen-content-before>
        <slot name="nav-screen-content-before" />
      </template>
      <template #nav-screen-content-after>
        <slot name="nav-screen-content-after" />
      </template>
      <template #nav-screen-menu-before>
        <slot name="nav-screen-menu-before" />
      </template>
      <template #nav-screen-menu-after>
        <slot name="nav-screen-menu-after" />
      </template>
    </VPNavScreen>
  </header>
</template>

<style scoped>
.vp-nav {
  position: relative;
  top: var(--vp-layout-top-height, 0);

  /* rtl:ignore */
  left: 0;
  z-index: var(--vp-z-index-nav);
  width: 100%;
  pointer-events: none;
}

.vp-nav.fixed {
  position: fixed;
}

.vp-nav.fixed :deep(.vp-navbar) {
  background-color: var(--vp-nav-bg-color);
  border-bottom-color: var(--vp-c-gutter);
}

@media (min-width: 960px) {
  .vp-nav {
    position: fixed;
  }
}

.vp-nav :deep(.vp-menu-badge) {
  padding: 3px 4px;
  margin-left: 4px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.2px;
  border-radius: 6px;
}
</style>
