<script setup lang="ts">
import { computed } from 'vue'
import { useData, useSidebar } from '../composables/index.js'
import VPBlog from './Blog/VPBlog.vue'
import VPDoc from './VPDoc.vue'
import VPPage from './VPPage.vue'
import VPHome from './Home/VPHome.vue'
import VPFriends from './VPFriends.vue'

const props = defineProps<{
  isNotFound?: boolean
}>()

const { hasSidebar } = useSidebar()
const { frontmatter, page } = useData()

const isBlogLayout = computed(() => {
  const { type } = page.value
  return type === 'blog' || type === 'blog-archives' || type === 'blog-tags'
})
</script>

<template>
  <div
    id="VPContent"
    vp-content
    class="vp-content" :class="{
      'has-sidebar': hasSidebar && !props.isNotFound,
      'is-home': frontmatter.pageLayout === 'home',
    }"
  >
    <VPBlog v-if="isBlogLayout" />

    <VPPage v-else-if="frontmatter.pageLayout === 'page'">
      <template #page-top>
        <slot name="page-top" />
      </template>
      <template #page-bottom>
        <slot name="page-bottom" />
      </template>
    </VPPage>

    <VPFriends v-else-if="frontmatter.pageLayout === 'friends'" />

    <VPHome v-else-if="frontmatter.pageLayout === 'home'" />

    <component
      :is="frontmatter.pageLayout"
      v-else-if="frontmatter.pageLayout && frontmatter.pageLayout !== 'doc'"
    />

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
