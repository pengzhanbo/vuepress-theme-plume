<script setup lang="ts">
import VPDocAside from '@theme/VPDocAside.vue'
import VPDocBreadcrumbs from '@theme/VPDocBreadcrumbs.vue'
import VPDocChangelog from '@theme/VPDocChangelog.vue'
import VPDocContributor from '@theme/VPDocContributor.vue'
import VPDocCopyright from '@theme/VPDocCopyright.vue'
import VPDocFooter from '@theme/VPDocFooter.vue'
import VPDocMeta from '@theme/VPDocMeta.vue'
import VPEncryptPage from '@theme/VPEncryptPage.vue'
import VPTransitionFadeSlideY from '@theme/VPTransitionFadeSlideY.vue'
import { computed, nextTick, ref, resolveComponent, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import {
  useBlogPageData,
  useData,
  useEncrypt,
  useHeaders,
  useSidebar,
} from '../composables/index.js'

const { page, theme, frontmatter, isDark } = useData()
const route = useRoute()

const { hasSidebar, hasAside, leftAside } = useSidebar()
const { isBlogPost } = useBlogPageData()
const headers = useHeaders()
const { isPageDecrypted } = useEncrypt()

const hasComments = computed(() => {
  return resolveComponent('CommentService') !== 'CommentService' && page.value.frontmatter.comments !== false && isPageDecrypted.value
})

const enableAside = computed(() => {
  if (!hasAside.value)
    return false

  if (isBlogPost.value)
    return headers.value.length > 0

  return true
})

const pageName = computed(() =>
  route.path.replace(/[./]+/g, '_').replace(/_html$/, ''),
)
const enabledExternalLinkIcon = computed(
  () =>
    theme.value.externalLinkIcon
    && frontmatter.value.externalLinkIcon !== false,
)

const asideEl = ref<HTMLElement>()
watch(
  () => route.hash,
  hash =>
    nextTick(() => {
      if (!asideEl.value)
        return
      const activeItem = asideEl.value.querySelector(
        `.outline-link[href="${hash}"]`,
      )
      if (!activeItem || !hash) {
        asideEl.value.scrollTop = 0
        return
      }

      const { top: navTop, height: navHeight }
        = asideEl.value.getBoundingClientRect()
      const { top: activeTop, height: activeHeight }
        = activeItem.getBoundingClientRect()

      if (activeTop < navTop || activeTop + activeHeight > navTop + navHeight)
        activeItem.scrollIntoView({ block: 'center' })
    }),
  { immediate: true },
)
</script>

<template>
  <VPTransitionFadeSlideY>
    <div
      :key="page.path" class="vp-doc-container" :class="{
        'has-sidebar': hasSidebar,
        'has-aside': enableAside,
        'is-blog': isBlogPost,
        'with-encrypt': !isPageDecrypted,
      }"
    >
      <slot name="doc-top" />
      <div class="container">
        <div v-if="enableAside" class="aside" :class="{ 'left-aside': leftAside }" vp-outline>
          <div class="aside-curtain" />
          <div ref="asideEl" class="aside-container">
            <div class="aside-content">
              <VPDocAside>
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
                <template #aside-ads-before>
                  <slot name="aside-ads-before" />
                </template>
                <template #aside-ads-after>
                  <slot name="aside-ads-after" />
                </template>
              </VPDocAside>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="content-container">
            <slot name="doc-before" />
            <main class="main">
              <VPDocBreadcrumbs />
              <VPDocMeta />
              <VPEncryptPage v-if="!isPageDecrypted" />
              <div
                v-else class="vp-doc plume-content"
                :class="[pageName, enabledExternalLinkIcon && 'external-link-icon-enabled']" vp-content
              >
                <Content />
                <VPDocContributor />
                <VPDocChangelog />
                <VPDocCopyright />
              </div>
            </main>
            <VPDocFooter v-if="isPageDecrypted">
              <template #doc-footer-before>
                <slot name="doc-footer-before" />
              </template>
            </VPDocFooter>
            <template v-if="hasComments">
              <DocComment :darkmode="isDark" vp-comment />
            </template>
            <slot name="doc-after" />
          </div>
        </div>
      </div>
      <slot name="doc-bottom" />
    </div>
  </VPTransitionFadeSlideY>
</template>

<style scoped>
.vp-doc-container {
  width: 100%;
  padding: 32px 24px 96px;
}

.vp-doc-container.with-encrypt {
  padding: 32px 24px;
}

.container {
  width: 100%;
  margin: 0 auto;
}

.aside {
  position: relative;

  display: none;
  flex-grow: 1;
  order: 2;

  width: 100%;
  max-width: 256px;
  padding-left: 32px;
}

.left-aside {
  order: 1;
  padding-right: 32px;
  padding-left: unset;
}

.aside-container {
  position: sticky;
  top: 0;
  min-height: calc(100vh - var(--vp-nav-height, 0px) - var(--vp-footer-height, 0px));
  max-height: 100vh;
  padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 32px);
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1 - 32px);
  overflow: hidden auto;

  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  --vp-aside-curtain-bg: var(--vp-c-bg);

  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-aside-curtain-bg) 70%);
  transition: --vp-aside-curtain-bg var(--vp-t-color);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + var(--vp-footer-height, 0px) + 48px));
  padding-bottom: 32px;
}

.content {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.content-container {
  margin: 0 auto;
}

.vp-doc-container.has-aside .content-container {
  max-width: 788px;
}

@media (min-width: 768px) {
  .vp-doc-container {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .vp-doc-container {
    padding: 48px 32px 0;
  }

  .vp-doc-container:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .vp-doc-container:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .vp-doc-container .container {
    display: flex;
    justify-content: center;
  }

  .vp-doc-container .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .vp-doc-container:not(.has-sidebar) .content {
    max-width: 884px;
  }

  .vp-doc-container.is-blog:not(.has-sidebar.has-aside) .content {
    max-width: 985px;
  }

  .vp-doc-container:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    min-width: 640px;
    margin: 0;
  }
}

@property --vp-aside-curtain-bg {
  inherits: false;
  initial-value: #fff;
  syntax: "<color>";
}
</style>
