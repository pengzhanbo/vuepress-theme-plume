<script setup lang="ts">
import VPNav from '@theme/Nav/VPNav.vue'
import VPBackdrop from '@theme/VPBackdrop.vue'
import VPBackToTop from '@theme/VPBackToTop.vue'
import VPBulletin from '@theme/VPBulletin.vue'
import VPContent from '@theme/VPContent.vue'
import VPEncryptGlobal from '@theme/VPEncryptGlobal.vue'
import VPFooter from '@theme/VPFooter.vue'
import VPLocalNav from '@theme/VPLocalNav.vue'
import VPSidebar from '@theme/VPSidebar.vue'
import VPSkipLink from '@theme/VPSkipLink.vue'
import { watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { useCloseSidebarOnEscape, useData, useEncrypt, useSidebar } from '../composables/index.js'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar,
} = useSidebar()

const { frontmatter } = useData()
const { isGlobalDecrypted, isPageDecrypted } = useEncrypt()

const route = useRoute()
watch(() => route.path, closeSidebar)

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)
</script>

<template>
  <div
    v-if="frontmatter.pageLayout !== false && frontmatter.pageLayout !== 'custom'" class="theme-plume vp-layout"
    :class="frontmatter.pageClass"
    vp-container
  >
    <VPEncryptGlobal v-if="!isGlobalDecrypted" />

    <template v-else>
      <slot name="layout-top" />

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

      <VPLocalNav
        :open="isSidebarOpen"
        :show-outline="isPageDecrypted"
        @open-menu="openSidebar"
      />

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
          <template #blog-top>
            <slot name="blog-top" />
          </template>
          <template #blog-bottom>
            <slot name="blog-bottom" />
          </template>
          <template #blog-archives-before>
            <slot name="blog-archives-before" />
          </template>
          <template #blog-archives-after>
            <slot name="blog-archives-after" />
          </template>
          <template #blog-tags-before>
            <slot name="blog-tags-before" />
          </template>
          <template #blog-tags-after>
            <slot name="blog-tags-after" />
          </template>
          <template #blog-tags-title-after>
            <slot name="blog-tags-title-after" />
          </template>
          <template #blog-tags-content-before>
            <slot name="blog-tags-content-before" />
          </template>
          <template #blog-categories-before>
            <slot name="blog-categories-before" />
          </template>
          <template #blog-categories-after>
            <slot name="blog-categories-after" />
          </template>
          <template #blog-categories-content-before>
            <slot name="blog-categories-content-before" />
          </template>
          <template #blog-post-list-before>
            <slot name="blog-post-list-before" />
          </template>
          <template #blog-post-list-after>
            <slot name="blog-post-list-after" />
          </template>
          <template #blog-post-list-pagination-after>
            <slot name="blog-post-list-pagination-after" />
          </template>
          <template #blog-aside-top>
            <slot name="blog-aside-top" />
          </template>
          <template #blog-aside-bottom>
            <slot name="blog-aside-bottom" />
          </template>
          <template #blog-extract-before>
            <slot name="blog-extract-before" />
          </template>
          <template #blog-extract-after>
            <slot name="blog-extract-after" />
          </template>
        </VPContent>
      </slot>
      <VPBackToTop />
      <VPFooter>
        <template #footer-content>
          <slot name="footer-content" />
        </template>
      </VPFooter>

      <slot name="layout-bottom" />
    </template>
  </div>
  <Content v-else vp-container vp-content />

  <VPBulletin>
    <template #bulletin-content>
      <slot name="bulletin-content" />
    </template>
  </VPBulletin>
</template>

<style scoped>
.vp-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
