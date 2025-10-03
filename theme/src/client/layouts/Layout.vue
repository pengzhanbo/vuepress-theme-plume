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
import VPSignDown from '@theme/VPSignDown.vue'
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
        <template #nav-bar-menu-before>
          <slot name="nav-bar-menu-before" />
        </template>
        <template #nav-bar-menu-after>
          <slot name="nav-bar-menu-after" />
        </template>
        <template #nav-screen-content-before>
          <slot name="nav-screen-content-before" />
        </template>
        <template #nav-screen-content-after>
          <slot name="nav-screen-content-after" />
        </template>
        <template #nav-screen-menu-before>
          <slot name="nav-screen-menu-before" />
        </template>
        <template #nav-screen-menu-after>
          <slot name="nav-screen-menu-after" />
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
          <template #doc-meta-before>
            <slot name="doc-meta-before" />
          </template>
          <template #doc-meta-after>
            <slot name="doc-meta-after" />
          </template>
          <template #doc-meta-top>
            <slot name="doc-meta-top" />
          </template>
          <template #doc-meta-bottom>
            <slot name="doc-meta-bottom" />
          </template>
          <template #doc-content-before>
            <slot name="doc-content-before" />
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
          <template #posts-top>
            <slot name="posts-top" />
          </template>
          <template #posts-bottom>
            <slot name="posts-bottom" />
          </template>
          <template #posts-archives-before>
            <slot name="posts-archives-before" />
          </template>
          <template #posts-archives-after>
            <slot name="posts-archives-after" />
          </template>
          <template #posts-tags-before>
            <slot name="posts-tags-before" />
          </template>
          <template #posts-tags-after>
            <slot name="posts-tags-after" />
          </template>
          <template #posts-tags-title-after>
            <slot name="posts-tags-title-after" />
          </template>
          <template #posts-tags-content-before>
            <slot name="posts-tags-content-before" />
          </template>
          <template #posts-categories-before>
            <slot name="posts-categories-before" />
          </template>
          <template #posts-categories-after>
            <slot name="posts-categories-after" />
          </template>
          <template #posts-categories-content-before>
            <slot name="posts-categories-content-before" />
          </template>
          <template #posts-post-list-before>
            <slot name="posts-post-list-before" />
          </template>
          <template #posts-post-list-after>
            <slot name="posts-post-list-after" />
          </template>
          <template #posts-post-list-pagination-after>
            <slot name="posts-post-list-pagination-after" />
          </template>
          <template #posts-aside-top>
            <slot name="posts-aside-top" />
          </template>
          <template #posts-aside-bottom>
            <slot name="posts-aside-bottom" />
          </template>
          <template #posts-extract-before>
            <slot name="posts-extract-before" />
          </template>
          <template #posts-extract-after>
            <slot name="posts-extract-after" />
          </template>
        </VPContent>
      </slot>
      <VPBackToTop />
      <VPSignDown />
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
