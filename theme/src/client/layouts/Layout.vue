<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import { computed, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { PlumeThemePageData } from '../../shared/index.js'
import Backdrop from '../components/Backdrop.vue'
import Blog from '../components/Blog.vue'
import Friends from '../components/Friends.vue'
import Home from '../components/Home.vue'
import LayoutContent from '../components/LayoutContent.vue'
import LocalNav from '../components/LocalNav.vue'
import Nav from '../components/Nav/index.vue'
import Page from '../components/Page.vue'
import Sidebar from '../components/Sidebar.vue'
import SkipLink from '../components/SkipLink.vue'
import VFooter from '../components/VFooter.vue'
import {
  useCloseSidebarOnEscape,
  useSidebar,
} from '../composables/index.js'

const page = usePageData<PlumeThemePageData>()

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar,
} = useSidebar()

const route = useRoute()
watch(() => route.path, closeSidebar)

const isBlogLayout = computed(() => {
  return (
    page.value.type === 'blog'
    || page.value.type === 'blog-archives'
    || page.value.type === 'blog-tags'
  )
})

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)

provide('close-sidebar', closeSidebar)
provide('is-sidebar-open', isSidebarOpen)
</script>

<template>
  <div class="theme-plume">
    <SkipLink />
    <Backdrop :show="isSidebarOpen" @click="closeSidebar" />
    <Nav />
    <LocalNav :open="isSidebarOpen" @open-menu="openSidebar" />
    <Sidebar :open="isSidebarOpen" />
    <LayoutContent>
      <Home v-if="page.frontmatter.home" />
      <Friends v-else-if="page.frontmatter.friends" />
      <Blog v-else-if="isBlogLayout" />
      <Page v-else />
      <VFooter />
    </LayoutContent>
  </div>
</template>

<style scoped>
.theme-plume {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
