<script lang="ts" setup>
import { usePageFrontmatter, } from '@vuepress/client'
import { useWindowScroll } from '@vueuse/core'
import { ref, watchPostEffect } from 'vue'
import { useSidebar } from '../../composables/sidebar.js'
import NavBarAppearance from './NavBarAppearance.vue'
import NavBarExtra from './NavBarExtra.vue'
import NavBarHamburger from './NavBarHamburger.vue'
import NavBarMenu from './NavBarMenu.vue'
import NavBarSearch from './NavBarSearch.vue'
import NavBarSocialLinks from './NavBarSocialLinks.vue'
import NavBarTitle from './NavBarTitle.vue'
import NavBarTranslations from './NavBarTranslations.vue'

defineProps<{
  isScreenOpen: boolean
}>()
defineEmits<(e: 'toggle-screen') => void>()

const matter = usePageFrontmatter()

const { y } = useWindowScroll()
const { hasSidebar } = useSidebar()

const classes = ref<Record<string, boolean>>({})
watchPostEffect(() => {
  classes.value = {
    'has-sidebar': hasSidebar.value,
    top: !!matter.value.home && y.value === 0,
  }
})
</script>

<template>
  <div class="navbar-wrapper" :class="classes">
    <div class="container">
      <div class="title">
        <NavBarTitle />
      </div>

      <div class="content">
        <div class="curtain"></div>
        <div class="content-body">
          <NavBarSearch class="search" />
          <NavBarMenu class="menu" />
          <NavBarTranslations class="translations" />
          <NavBarAppearance class="appearance" />
          <NavBarSocialLinks class="social-links" />
          <NavBarExtra class="extra" />
          <NavBarHamburger
            class="hamburger"
            :active="isScreenOpen"
            @click="$emit('toggle-screen')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar-wrapper {
  position: relative;
  border-bottom: 1px solid transparent;
  padding: 0 8px 0 24px;
  height: var(--vp-nav-height);
  pointer-events: none;
  white-space: nowrap;
}


@media (min-width: 768px) {
  .navbar-wrapper {
    padding: 0 32px;
  }
}

@media (min-width: 960px) {
  .navbar-wrapper.has-sidebar {
    padding: 0;
  }

  .navbar-wrapper:not(.has-sidebar):not(.top) {
    border-bottom-color: var(--vp-c-gutter);
    background-color: var(--vp-nav-bg-color);
  }
}

.container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  height: var(--vp-nav-height);
  pointer-events: none;
}

.container :deep(*) {
  pointer-events: auto;
}

@media (min-width: 960px) {
  .navbar-wrapper.has-sidebar .container {
    max-width: 100%;
  }
}

.title {
  flex-shrink: 0;
  height: calc(var(--vp-nav-height) - 1px);
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .navbar-wrapper.has-sidebar .title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    padding: 0 32px;
    width: var(--vp-sidebar-width);
    height: var(--vp-nav-height);
    background-color: transparent;
  }
}

@media (min-width: 1440px) {
  .navbar-wrapper.has-sidebar .title {
    padding-left: max(
      32px,
      calc((100% - (var(--vp-layout-max-width) - 64px)) / 2)
    );
    width: calc(
      (100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) -
        32px
    );
  }
}

.content {
  flex-grow: 1;
}

@media (min-width: 960px) {
  .navbar-wrapper.has-sidebar .content {
    position: relative;
    z-index: 1;
    padding-right: 32px;
    padding-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .navbar-wrapper.has-sidebar .content {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 32px);
    padding-left: calc(
      (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width)
    );
  }
}

.content-body {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: calc(var(--vp-nav-height) - 1px);
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .navbar-wrapper:not(.top) .content-body {
    position: relative;
    background-color: var(--vp-nav-bg-color);
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
.appearance + .social-links::before {
  margin-right: 8px;
  margin-left: 8px;
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
  content: '';
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

@media (min-width: 960px) {
  .navbar-wrapper.has-sidebar .curtain {
    position: absolute;
    right: 0;
    bottom: -31px;
    width: calc(100% - var(--vp-sidebar-width));
    height: 32px;
  }

  .navbar-wrapper.has-sidebar .curtain::before {
    display: block;
    width: 100%;
    height: 32px;
    background: linear-gradient(var(--vp-c-bg), transparent 70%);
    content: '';
  }
}

@media (min-width: 1440px) {
  .navbar-wrapper.has-sidebar .curtain {
    width: calc(
      100% -
        ((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width))
    );
  }
}
</style>