<script lang="ts" setup>
import { usePageData } from 'vuepress/client'
import type { PlumeThemePageData } from '../../shared/index.js'
import Archives from './Archives.vue'
import BlogAside from './BlogAside.vue'
import BlogExtract from './BlogExtract.vue'
import PostList from './PostList.vue'
import Tags from './Tags.vue'

const page = usePageData<PlumeThemePageData>()
</script>

<template>
  <div class="blog-wrapper">
    <PostList v-if="page.type === 'blog'" />
    <Tags v-if="page.type === 'blog-tags'" />
    <Archives v-if="page.type === 'blog-archives'" />
    <BlogAside />
    <BlogExtract />
  </div>
</template>

<style scoped>
.blog-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding-top: var(--vp-nav-height);
  margin: 0 auto;
}

@media (min-width: 960px) {
  .blog-wrapper {
    max-width: 784px;
    padding-top: 0;
  }
}

@media (min-width: 1440px) {
  .blog-wrapper {
    max-width: 1104px;
  }
}
</style>
