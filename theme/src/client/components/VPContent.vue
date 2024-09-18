<script setup lang="ts">
import VPBlog from '@theme/Blog/VPBlog.vue'
import VPHome from '@theme/Home/VPHome.vue'
import VPDoc from '@theme/VPDoc.vue'
import VPFriends from '@theme/VPFriends.vue'
import VPPage from '@theme/VPPage.vue'
import { nextTick, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { useBlogPageData, useData, useSidebar } from '../composables/index.js'
import { inBrowser } from '../utils/index.js'

const props = defineProps<{
  isNotFound?: boolean
}>()

const { hasSidebar } = useSidebar()
const { frontmatter } = useData()
const { isBlogLayout } = useBlogPageData()
const route = useRoute()

watch(
  [isBlogLayout, () => frontmatter.value.pageLayout, () => route.path],
  () => nextTick(() => {
    if (inBrowser) {
      document.documentElement.classList.toggle('bg-gray', isBlogLayout.value)
      const layout = document.documentElement.className.match(/(?:^|\s)(layout-\S+)(?:$|\s)/)?.[1]
      if (layout)
        document.documentElement.classList.remove(layout)
      document.documentElement.classList.add(`layout-${isBlogLayout.value ? 'blog' : frontmatter.value.pageLayout || 'doc'}`)
    }
  }),
  { immediate: true },
)
</script>

<template>
  <div
    id="VPContent" vp-content class="vp-content" :class="{
      'has-sidebar': hasSidebar && !props.isNotFound,
      'is-home': frontmatter.pageLayout === 'home',
    }"
  >
    <VPBlog v-if="isBlogLayout">
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
    </VPBlog>

    <VPPage v-else-if="frontmatter.pageLayout === 'page'">
      <template #page-top>
        <slot name="page-top" />
      </template>
      <template #page-bottom>
        <slot name="page-bottom" />
      </template>
    </VPPage>

    <VPFriends v-else-if="frontmatter.pageLayout === 'friends'" />

    <VPHome v-else-if="frontmatter.pageLayout === 'home'">
      <template #blog-top>
        <slot name="blog-top" />
      </template>
      <template #blog-bottom>
        <slot name="blog-bottom" />
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
    </VPHome>

    <component :is="frontmatter.pageLayout" v-else-if="frontmatter.pageLayout && frontmatter.pageLayout !== 'doc'" />

    <VPDoc v-else>
      <template #doc-top>
        <slot name="doc-top" />
      </template>
      <template #doc-bottom>
        <slot name="doc-bottom" />
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

      <template #aside-top>
        <slot name="aside-top" />
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
      <template #aside-bottom>
        <slot name="aside-bottom" />
      </template>
    </VPDoc>
  </div>
</template>

<style scoped>
.vp-content {
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  margin: var(--vp-layout-top-height, 0) auto 0;
}

.vp-content.is-home {
  width: 100%;
  max-width: 100%;
}

.vp-content.has-sidebar {
  margin: 0;
}

@media (min-width: 960px) {
  .vp-content {
    padding-top: var(--vp-nav-height);
  }

  .vp-content.has-sidebar {
    padding-left: var(--vp-sidebar-width);
    margin: var(--vp-layout-top-height, 0) 0 0;
  }
}

@media (min-width: 1440px) {
  .vp-content.has-sidebar {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}
</style>
