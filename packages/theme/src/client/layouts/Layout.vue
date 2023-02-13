<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import { provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { PlumeThemePageData } from '../../shared/index.js'
import Backdrop from '../components/Backdrop.vue'
import Blog from '../components/Blog.vue'
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
  useScrollPromise,
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

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)

provide('close-sidebar', closeSidebar)
provide('is-sidebar-open', isSidebarOpen)

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
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
      <Blog v-else-if="page.type === 'blog'" />
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
