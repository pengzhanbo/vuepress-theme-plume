<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import { computed } from 'vue'
import { useMediumZoom } from '@vuepress/plugin-medium-zoom/client'
import { onContentUpdated } from '@vuepress-plume/plugin-content-update/client'
import type { PlumeThemePageData } from '../../shared/index.js'
import { useDarkMode, useSidebar } from '../composables/index.js'
import PageAside from './PageAside.vue'
import PageFooter from './PageFooter.vue'
import PageMeta from './PageMeta.vue'

const { hasSidebar, hasAside } = useSidebar()
const isDark = useDarkMode()
const page = usePageData<PlumeThemePageData>()

const hasComments = computed(() => {
  return page.value.frontmatter.comments !== false
})

const zoom = useMediumZoom()

onContentUpdated(() => zoom?.refresh())
</script>

<template>
  <div
    class="plume-page"
    :class="{
      'has-sidebar': hasSidebar,
      'has-aside': hasAside,
      'is-blog': page.isBlogPost,
    }"
  >
    <div class="container">
      <div v-if="hasAside" class="aside">
        <div class="aside-curtain" />
        <div class="aside-container">
          <div class="aside-content">
            <PageAside />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="content-container">
          <main class="main">
            <PageMeta />
            <Content class="plume-content" />
            <PageFooter />
            <PageComment v-if="hasComments" :darkmode="isDark" />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plume-page {
  position: relative;
  display: flex;
}

.plume-page {
  width: 100%;
  padding: 32px 24px 96px;
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

.aside-container {
  position: sticky;
  top: 0;
  height: 100vh;
  padding-top:
    calc(
      var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 32px
    );
  margin-top:
    calc(
      (var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1 - 32px
    );
  overflow: hidden auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height:
    calc(
      100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 32px)
    );
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

.plume-page.has-aside .content-container {
  max-width: 688px;
}

.giscus-wrapper {
  padding: 5rem 0 0;
}

@media (min-width: 768px) {
  .plume-page {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .plume-page,
  .plume-page.is-blog {
    padding: 32px 32px 0;
  }

  .plume-page:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .plume-page:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .plume-page .container {
    display: flex;
    justify-content: center;
  }

  .plume-page .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .plume-page:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .plume-page:not(.has-sidebar) .container {
    max-width: 1204px;
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
</style>
