<script setup lang="ts">
import { useRoute } from 'vuepress/client'
import { watch } from 'vue'
import VPBackdrop from '../components/VPBackdrop.vue'
import VPContent from '../components/VPContent.vue'
import VPLocalNav from '../components/VPLocalNav.vue'
import VPNav from '../components/Nav/VPNav.vue'
import VPSidebar from '../components/VPSidebar.vue'
import VPSkipLink from '../components/VPSkipLink.vue'
import VPFooter from '../components/VPFooter.vue'
import VPBackToTop from '../components/VPBackToTop.vue'
import VPEncryptGlobal from '../components/VPEncryptGlobal.vue'
import { useCloseSidebarOnEscape, useSidebar } from '../composables/sidebar.js'
import { useGlobalEncrypt, usePageEncrypt } from '../composables/encrypt.js'
import { useData } from '../composables/data.js'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar,
} = useSidebar()

const { frontmatter } = useData()
const { isGlobalDecrypted } = useGlobalEncrypt()
const { isPageDecrypted } = usePageEncrypt()

const route = useRoute()
watch(() => route.path, closeSidebar)

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)
</script>

<template>
  <div
    v-if="frontmatter.pageLayout !== false && frontmatter.pageLayout !== 'custom'" class="theme-plume vp-layout"
    :class="frontmatter.pageClass"
  >
    <VPEncryptGlobal v-if="!isGlobalDecrypted" />

    <template v-else>
      <VPSkipLink />

      <VPBackdrop :show="isSidebarOpen" @click="closeSidebar" />

      <VPNav>
        <template #nav-bar-title-before>
          <slot name="nav-bar-title-before" />
        </template>
        <template #nav-bar-title-after>
          <slot name="nav-bar-title-after" />
        </template>
        <template #nav-bar-content-before>
          <slot name="nav-bar-content-before" />
        </template>
        <template #nav-bar-content-after>
          <slot name="nav-bar-content-after" />
        </template>
        <template #nav-screen-content-before>
          <slot name="nav-screen-content-before" />
        </template>
        <template #nav-screen-content-after>
          <slot name="nav-screen-content-after" />
        </template>
      </VPNav>

      <VPLocalNav :open="isSidebarOpen" :show-outline="isPageDecrypted" @open-menu="openSidebar" />

      <VPSidebar :open="isSidebarOpen">
        <template #sidebar-nav-before>
          <slot name="sidebar-nav-before" />
        </template>
        <template #sidebar-nav-after>
          <slot name="sidebar-nav-after" />
        </template>
      </VPSidebar>

      <slot name="custom-content">
        <VPContent>
          <template #page-top>
            <slot name="page-top" />
          </template>
          <template #page-bottom>
            <slot name="page-bottom" />
          </template>
          <template #doc-footer-before>
            <slot name="doc-footer-before" />
          </template>
          <template #doc-before>
            <slot name="doc-before" />
          </template>
          <template #doc-after>
            <slot name="doc-after" />
          </template>
          <template #doc-top>
            <slot name="doc-top" />
          </template>
          <template #doc-bottom>
            <slot name="doc-bottom" />
          </template>

          <template #aside-top>
            <slot name="aside-top" />
          </template>
          <template #aside-bottom>
            <slot name="aside-bottom" />
          </template>
          <template #aside-outline-before>
            <slot name="aside-outline-before" />
          </template>
          <template #aside-outline-after>
            <slot name="aside-outline-after" />
          </template>
        </VPContent>
      </slot>
      <VPBackToTop />
      <VPFooter />
    </template>
  </div>
  <Content v-else />
</template>

<style scoped>
.vp-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
