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
    <div class="blog-container">
      <PostList v-if="page.type === 'blog'" />
      <Tags v-if="page.type === 'blog-tags'" />
      <Archives v-if="page.type === 'blog-archives'" />
      <BlogAside />
      <BlogExtract />
    </div>
  </div>
</template>

<style scoped>
.blog-wrapper {
  min-height: calc(100vh - var(--vp-footer-height, 0px));
}

.blog-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding-top: var(--vp-nav-height);
  margin: 0 auto;
}

@media (min-width: 768px) {
  .blog-wrapper {
    min-height: calc(100vh + var(--vp-nav-height) - var(--vp-footer-height, 0px));
  }

  .blog-wrapper {
    padding-top: var(--vp-nav-height);
    margin-top: calc(var(--vp-nav-height) * -1);
    background-color: var(--vp-c-bg-alt);
  }
}

@media (min-width: 960px) {
  .blog-wrapper {
    min-height: calc(100vh - var(--vp-footer-height, 0px));
  }

  .blog-container {
    max-width: 784px;
    padding-top: 0;
  }
}

@media (min-width: 1440px) {
  .blog-container {
    max-width: 1104px;
  }
}
</style>
