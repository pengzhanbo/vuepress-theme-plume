<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import { provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { PlumeThemePageData } from '../../shared/index.js'
import LayoutContent from '../components/LayoutContent.vue'
import Nav from '../components/Nav/index.vue'
import Page from '../components/Page.vue'
import Sidebar from '../components/Sidebar.vue'
import {
  useCloseSidebarOnEscape,
  useScrollPromise,
  useSidebar,
  useThemeLocaleData,
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
    <Nav />
    <Sidebar :open="isSidebarOpen" />
    <LayoutContent>
      <Page />
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
