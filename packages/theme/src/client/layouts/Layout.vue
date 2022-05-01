<script setup lang="ts">
import Archive from '@theme-plume/Archive.vue'
import AsideNavbar from '@theme-plume/AsideNavbar.vue'
import BackToTop from '@theme-plume/BackToTop.vue'
import Category from '@theme-plume/Category.vue'
import Home from '@theme-plume/Home.vue'
import Navbar from '@theme-plume/Navbar.vue'
import Page from '@theme-plume/Page.vue'
import PageFooter from '@theme-plume/PageFooter.vue'
import Tag from '@theme-plume/Tag.vue'
import { usePageFrontmatter } from '@vuepress/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeLocaleData } from '../composables'

const route = useRoute()
const frontmatter = usePageFrontmatter()
const themeLocale = useThemeLocaleData()
const isHome = computed(() => {
  return route.path === '/' && frontmatter.value.home
})

const pageType = computed(() => {
  return (frontmatter.value.pageType as string) || ''
})

const footer = computed(() => {
  return themeLocale.value.footer
})

const pageMap = {
  category: Category,
  archive: Archive,
  tag: Tag,
}
</script>
<template>
  <div class="plume-theme" :class="footer ? 'bottom' : ''">
    <slot name="navbar">
      <Navbar>
        <template #before>
          <slot name="navbar-before"></slot>
        </template>
        <template #after>
          <slot name="navbar-after"></slot>
        </template>
      </Navbar>
    </slot>
    <AsideNavbar />
    <slot name="page">
      <Home v-if="isHome" />
      <Component :is="pageMap[pageType]" v-else-if="pageType" />
      <Page v-else>
        <template #top>
          <slot name="page-top" />
        </template>
        <template #bottom>
          <slot name="page-bottom" />
        </template>
      </Page>
    </slot>
    <BackToTop />
    <slot name="footer">
      <PageFooter></PageFooter>
    </slot>
  </div>
</template>
