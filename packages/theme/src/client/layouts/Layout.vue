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
import type { Component } from 'vue'
import { computed } from 'vue'
import { useThemeLocaleData } from '../composables/index.js'

const frontmatter = usePageFrontmatter()
const themeLocale = useThemeLocaleData()

const pageType = computed<string>(() => {
  const matter = frontmatter.value
  let type = ''
  if (matter.home) {
    type = 'home'
  } else {
    type = (frontmatter.value.pageType as string) || ''
  }
  return type
})

const footer = computed(() => {
  return themeLocale.value.footer
})

const pageMap: Record<string, Component> = {
  category: Category,
  archive: Archive,
  tag: Tag,
  home: Home,
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
      <Component :is="pageMap[pageType]" v-if="pageType" />
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
