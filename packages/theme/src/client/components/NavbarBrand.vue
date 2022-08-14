<script lang="ts" setup>
import {
  ClientOnly,
  useRouteLocale,
  useSiteLocaleData,
  withBase,
} from '@vuepress/client'
import { computed, h } from 'vue'
import type { FunctionalComponent } from 'vue'
import type { NavLink } from '../../shared'
import {
  useDarkMode,
  useSidebarIndex,
  useThemeLocaleData,
} from '../composables'

const routeLocale = useRouteLocale()
const siteLocale = useSiteLocaleData()
const themeLocale = useThemeLocaleData()
const isDarkMode = useDarkMode()
const { hasSidebar } = useSidebarIndex()

const navbarBrandLink = computed(
  () => (themeLocale.value.home as NavLink)?.link || routeLocale.value
)
const navbarBrandTitle = computed(() => siteLocale.value.title)
const navbarBrandLogo = computed(() => {
  if (isDarkMode.value && themeLocale.value.logoDark !== undefined) {
    return themeLocale.value.logoDark
  }
  return themeLocale.value.logo
})
const NavbarBrandLogo: FunctionalComponent = () => {
  if (!navbarBrandLogo.value) return null
  const img = h('img', {
    class: 'logo',
    src: withBase(navbarBrandLogo.value),
    alt: navbarBrandTitle.value,
  })
  if (themeLocale.value.logoDark === undefined) {
    return img
  }
  return h(ClientOnly, img)
}
</script>

<template>
  <RouterLink
    :to="navbarBrandLink"
    :class="{
      'navbar-brand': true,
      'has-sidebar': hasSidebar,
    }"
  >
    <NavbarBrandLogo />
    <span
      v-if="navbarBrandTitle"
      class="site-name"
      :class="{ 'can-hide': navbarBrandLogo }"
    >
      {{ navbarBrandTitle }}
    </span>
  </RouterLink>
</template>
<style lang="scss">
.navbar-brand {
  display: flex;
  height: 100%;
  align-items: center;

  &.has-sidebar {
    width: calc(18rem - var(--navbar-padding-h));
    border-bottom: solid 1px var(--c-border);
  }
}
</style>
