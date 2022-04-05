<script setup lang="ts">
import Archive from '@theme-plume/Archive.vue'
import Category from '@theme-plume/Category.vue'
import Home from '@theme-plume/Home.vue'
import Navbar from '@theme-plume/Navbar.vue'
import Page from '@theme-plume/Page.vue'
import PageFooter from '@theme-plume/PageFooter.vue'
import Tag from '@theme-plume/Tag.vue'
import { usePageFrontmatter } from '@vuepress/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const frontmatter = usePageFrontmatter()
const isHome = computed(() => {
  return route.path === '/' && frontmatter.value.home
})

const pageType = computed(() => {
  return (frontmatter.value.pageType as string) || ''
})

const pageMap = {
  category: Category,
  archive: Archive,
  tag: Tag,
}
</script>
<template>
  <div class="plume-theme">
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
    <slot name="footer">
      <PageFooter />
    </slot>
  </div>
</template>
