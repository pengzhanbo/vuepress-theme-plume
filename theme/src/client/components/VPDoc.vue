<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { useData } from '../composables/data.js'
import { useSidebar } from '../composables/sidebar.js'
import { usePageEncrypt } from '../composables/encrypt.js'
import TransitionFadeSlideY from './TransitionFadeSlideY.vue'
import VPDocAside from './VPDocAside.vue'
import VPDocFooter from './VPDocFooter.vue'
import VPEncryptPage from './VPEncryptPage.vue'
import VPDocMeta from './VPDocMeta.vue'

const { page, theme, frontmatter, isDark } = useData()
const route = useRoute()

const { hasSidebar, hasAside, leftAside } = useSidebar()
const { isPageDecrypted } = usePageEncrypt()

const hasComments = computed(() => {
  return page.value.frontmatter.comments !== false
})

const enableAside = computed(() => {
  if (page.value.isBlogPost)
    return hasAside.value && isPageDecrypted.value && page.value.headers.length

  return hasAside.value && isPageDecrypted.value
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
  <TransitionFadeSlideY>
    <div
      :key="page.path" class="vp-doc-container" :class="{
        'has-sidebar': hasSidebar,
        'has-aside': hasAside,
        'is-blog': page.isBlogPost,
        'with-encrypt': !isPageDecrypted,
      }"
    >
      <slot name="doc-top" />
      <div class="container">
        <div v-if="enableAside" class="aside" :class="{ 'left-aside': leftAside }">
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
              <VPDocMeta />
              <VPEncryptPage v-if="!isPageDecrypted" />
              <Content
                v-else class="vp-doc plume-content"
                :class="[pageName, enabledExternalLinkIcon && 'external-link-icon-enabled']"
              />
            </main>
            <VPDocFooter>
              <template #doc-footer-before>
                <slot name="doc-footer-before" />
              </template>
            </VPDocFooter>
            <PageComment v-if="hasComments" :darkmode="isDark" />
            <slot name="doc-after" />
          </div>
        </div>
      </div>
    </div>
  </TransitionFadeSlideY>
</template>

<style scoped>
.vp-doc-container {
  width: 100%;
  padding: 32px 24px 96px;
}

.vp-doc-container.with-encrypt {
  padding: 32px 24px;
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
    max-width: 784px;
  }

  .vp-doc-container:not(.has-sidebar) .container {
    max-width: 1104px;
  }
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
  min-height: calc(100vh - var(--vp-footer-height, 0px));
  max-height: 100vh;
  padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 32px);
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1 - 32px);
  overflow: hidden auto;

  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

@property --vp-aside-curtain-bg {
  inherits: false;
  initial-value: #fff;
  syntax: "<color>";
}

.aside-curtain {
  --vp-aside-curtain-bg: var(--vp-c-bg);

  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-aside-curtain-bg) 70%);
  transition: --vp-aside-curtain-bg var(--t-color);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px));
  padding-bottom: 32px;
}

.content {
  position: relative;
  width: 100%;
  margin: 0 auto;
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

.content-container {
  margin: 0 auto;
}

.vp-doc-container.has-aside .content-container {
  max-width: 688px;
}
</style>
