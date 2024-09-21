<script lang="ts" setup>
import VPImage from '@theme/VPImage.vue'
import VPLink from '@theme/VPLink.vue'
import { useRouteLocale } from 'vuepress/client'
import { useData, useSidebar } from '../../composables/index.js'

const { theme, site } = useData()
const { hasSidebar } = useSidebar()
const routeLocale = useRouteLocale()
</script>

<template>
  <div class="vp-navbar-title" :class="{ 'has-sidebar': hasSidebar }">
    <VPLink class="title" :href="theme.home ?? routeLocale">
      <slot name="nav-bar-title-before" />

      <VPImage
        v-if="theme.logo"
        class="logo"
        :image="{ light: theme.logo, dark: theme.logoDark || theme.logo }"
      />
      <span>{{ site.title }}</span>

      <slot name="nav-bar-title-after" />
    </VPLink>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--vp-nav-height);
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid transparent;
  transition: opacity var(--vp-t-color), color var(--vp-t-color), border-bottom var(--vp-t-color);
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }

  .vp-navbar-title.has-sidebar .title {
    border-bottom-color: var(--vp-c-divider);
  }
}

:deep(.logo) {
  height: min(var(--vp-nav-logo-height, 24px), 48px);
  margin-right: 8px;
}
</style>
