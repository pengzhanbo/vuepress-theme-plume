<script lang="ts" setup>
import VPNavBarAppearance from '@theme/Nav/VPNavBarAppearance.vue'
import VPNavBarExtra from '@theme/Nav/VPNavBarExtra.vue'
import VPNavBarHamburger from '@theme/Nav/VPNavBarHamburger.vue'
import VPNavBarMenu from '@theme/Nav/VPNavBarMenu.vue'
import VPNavBarSearch from '@theme/Nav/VPNavBarSearch.vue'
import VPNavBarSocialLinks from '@theme/Nav/VPNavBarSocialLinks.vue'
import VPNavBarTitle from '@theme/Nav/VPNavBarTitle.vue'
import VPNavBarTranslations from '@theme/Nav/VPNavBarTranslations.vue'
import { useWindowScroll } from '@vueuse/core'
import { ref, watchPostEffect } from 'vue'
import { useData, useSidebar } from '../../composables/index.js'

const props = defineProps<{
  isScreenOpen: boolean
}>()
defineEmits<(e: 'toggleScreen') => void>()

const { frontmatter } = useData()

const { y } = useWindowScroll()
const { hasSidebar } = useSidebar()

const classes = ref<Record<string, boolean>>({})
watchPostEffect(() => {
  classes.value = {
    'has-sidebar': hasSidebar.value,
    'home': frontmatter.value.pageLayout === 'home',
    'top': y.value === 0,
    'screen-open': props.isScreenOpen,
  }
})
</script>

<template>
  <div class="vp-navbar" :class="classes" vp-navbar>
    <div class="wrapper">
      <div class="container">
        <div class="title">
          <VPNavBarTitle>
            <template #nav-bar-title-before>
              <slot name="nav-bar-title-before" />
            </template>
            <template #nav-bar-title-after>
              <slot name="nav-bar-title-after" />
            </template>
          </VPNavBarTitle>
        </div>

        <div class="content">
          <div class="content-body">
            <slot name="nav-bar-content-before" />
            <VPNavBarSearch class="search" />
            <VPNavBarMenu class="menu" />
            <VPNavBarTranslations class="translations" />
            <VPNavBarAppearance class="appearance" />
            <VPNavBarSocialLinks class="social-links" />
            <VPNavBarExtra class="extra" />
            <slot name="nav-bar-content-after" />
            <VPNavBarHamburger
              class="hamburger"
              :active="isScreenOpen"
              @click="$emit('toggleScreen')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="divider">
      <div class="divider-line" />
    </div>
  </div>
</template>

<style scoped>
.vp-navbar {
  position: relative;
  height: var(--vp-nav-height);
  white-space: nowrap;
  pointer-events: none;
  transition: var(--vp-t-color);
  transition-property: background-color, color, border-bottom;
}

.vp-navbar.screen-open {
  background-color: var(--vp-nav-bg-color);
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-navbar:not(.home) {
  background-color: var(--vp-nav-bg-color);
}

@media (min-width: 960px) {
  .vp-navbar:not(.home) {
    background-color: transparent;
  }

  .vp-navbar:not(.has-sidebar, .home.top) {
    background-color: var(--vp-nav-bg-color);
  }
}

.wrapper {
  padding: 0 8px 0 24px;
}

@media (min-width: 768px) {
  .wrapper {
    padding: 0 32px;
  }
}

@media (min-width: 960px) {
  .vp-navbar.has-sidebar .wrapper {
    padding: 0;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  height: var(--vp-nav-height);
  margin: 0 auto;
  pointer-events: none;
}

.content {
  flex-grow: 1;
}

.title {
  flex-shrink: 0;
  height: calc(var(--vp-nav-height) - 1px);
  transition: background-color var(--vp-t-color);
}

.container > .title,
.container > .content {
  pointer-events: none;
}

.container :deep(*) {
  pointer-events: auto;
}

@media (min-width: 960px) {
  .vp-navbar.has-sidebar .container {
    max-width: 100%;
  }
}

@media (min-width: 960px) {
  .vp-navbar.has-sidebar .title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: var(--vp-sidebar-width);
    height: var(--vp-nav-height);
    padding: 0 32px;
    background-color: transparent;
  }
}

@media (min-width: 1440px) {
  .vp-navbar.has-sidebar .title {
    width: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
    padding-left:
      max(32px,
      calc((100% - (var(--vp-layout-max-width) - 64px)) / 2));
  }
}

@media (min-width: 960px) {
  .vp-navbar.has-sidebar .content {
    position: relative;
    z-index: 1;
    padding-right: 32px;
    padding-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .vp-navbar.has-sidebar .content {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 32px);
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

.content-body {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  height: var(--vp-nav-height);

  transition: background-color var(--vp-t-color);
}

@media (min-width: 960px) {
  .vp-navbar:not(.home.top) .content-body {
    position: relative;
    background-color: var(--vp-nav-bg-color);
  }

  .vp-navbar:not(.has-sidebar, .home.top) .content-body {
    background-color: transparent;
  }
}

@media (max-width: 767px) {
  .content-body {
    column-gap: 0.5rem;
  }
}

.menu + .translations::before,
.menu + .appearance::before,
.menu + .social-links::before,
.translations + .appearance::before,
.translations + .social-links::before,
.appearance + .social-links::before {
  width: 1px;
  height: 24px;
  margin-right: 8px;
  margin-left: 8px;
  content: "";
  background-color: var(--vp-c-divider);
  transition: background-color var(--vp-t-color);
}

.menu + .appearance::before,
.translations + .appearance::before {
  margin-right: 16px;
}

.appearance + .social-links::before {
  margin-left: 16px;
}

.social-links {
  margin-right: -8px;
}

.divider {
  width: 100%;
  height: 1px;
}

@media (min-width: 960px) {
  .vp-navbar.has-sidebar .divider {
    padding-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .vp-navbar.has-sidebar .divider {
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

.vp-navbar.screen-open .divider {
  display: none;
}

.divider-line {
  width: 100%;
  height: 1px;
  transition: background-color var(--vp-t-color);
}

.vp-navbar:not(.home) .divider-line {
  background-color: var(--vp-c-gutter);
}

@media (min-width: 960px) {
  .vp-navbar:not(.home.top) .divider-line {
    background-color: var(--vp-c-gutter);
  }

  .vp-navbar:not(.has-sidebar, .home.top) .divider {
    background-color: var(--vp-c-gutter);
  }
}

@media print {
  .vp-navbar .hamburger {
    display: none;
  }
}
</style>
