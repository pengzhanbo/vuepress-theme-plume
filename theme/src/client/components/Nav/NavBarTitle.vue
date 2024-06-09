<script lang="ts" setup>
import { useRouteLocale } from 'vuepress/client'
import { useSidebar } from '../../composables/sidebar.js'
import { useData } from '../../composables/data.js'
import AutoLink from '../AutoLink.vue'
import VImage from '../VImage.vue'

const { theme, site } = useData()
const { hasSidebar } = useSidebar()
const routeLocale = useRouteLocale()
</script>

<template>
  <div class="navbar-title" :class="{ 'has-sidebar': hasSidebar }">
    <AutoLink class="title" :href="theme.home ?? routeLocale">
      <VImage
        v-if="theme.logo"
        class="logo"
        :image="{ light: theme.logo, dark: theme.logoDark || theme.logo }"
      />
      {{ site.title }}
    </AutoLink>
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
  transition: opacity var(--t-color), color var(--t-color), border-bottom var(--t-color);
}

.title:hover {
  opacity: 0.6;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }

  .navbar-title.has-sidebar .title {
    border-bottom-color: var(--vp-c-divider);
  }
}

:deep(.logo) {
  height: 24px;
  margin-right: 8px;
}
</style>
