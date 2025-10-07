<script setup lang="ts">
import VPHome from '@theme/Home/VPHome.vue'
import VPPosts from '@theme/Posts/VPPosts.vue'
import VPDoc from '@theme/VPDoc.vue'
import VPFriends from '@theme/VPFriends.vue'
import VPPage from '@theme/VPPage.vue'
import { nextTick, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { useData, usePostsPageData, useSidebar } from '../composables/index.js'
import { inBrowser } from '../utils/index.js'

const props = defineProps<{
  isNotFound?: boolean
}>()

const { hasSidebar } = useSidebar()
const { frontmatter } = useData()
const { isPostsLayout } = usePostsPageData()
const route = useRoute()

watch(
  [isPostsLayout, () => frontmatter.value.pageLayout, () => route.path],
  () => nextTick(() => {
    if (inBrowser) {
      document.documentElement.classList.toggle('bg-gray', isPostsLayout.value)
      const layout = document.documentElement.className.match(/(?:^|\s)(layout-\S+)(?:$|\s)/)?.[1]
      if (layout)
        document.documentElement.classList.remove(layout)
      document.documentElement.classList.add(`layout-${isPostsLayout.value ? 'posts' : frontmatter.value.pageLayout || 'doc'}`)
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
    <VPPosts
      v-if="isPostsLayout || frontmatter.pageLayout === 'posts'"
      :home-posts="frontmatter.pageLayout === 'posts'"
      :collection="frontmatter.collection as string"
    >
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
    </VPPosts>

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
      <template #posts-top>
        <slot name="posts-top" />
      </template>
      <template #posts-bottom>
        <slot name="posts-bottom" />
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
    </VPHome>

    <component :is="frontmatter.pageLayout" v-else-if="frontmatter.pageLayout && frontmatter.pageLayout !== 'doc'" />

    <VPDoc v-else>
      <template #doc-top>
        <slot name="doc-top" />
      </template>
      <template #doc-bottom>
        <slot name="doc-bottom" />
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
