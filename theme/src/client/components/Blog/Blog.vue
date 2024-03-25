<script lang="ts" setup>
import { usePageData } from 'vuepress/client'
import { computed } from 'vue'
import type { PlumeThemePageData } from '../../../shared/index.js'
import { useThemeLocaleData } from '../../composables/index.js'
import TransitionFadeSlideY from '../TransitionFadeSlideY.vue'
import PostList from './PostList.vue'
import Archives from './Archives.vue'
import BlogAside from './BlogAside.vue'
import BlogExtract from './BlogExtract.vue'
import Tags from './Tags.vue'
import BlogNav from './BlogNav.vue'

const theme = useThemeLocaleData()
const page = usePageData<PlumeThemePageData>()

const com = {
  PostList,
  Tags,
  Archives,
}

const type = computed(() => {
  const type = page.value.type
  if (type === 'blog-tags')
    return 'Tags'
  if (type === 'blog-archives')
    return 'Archives'
  return 'PostList'
})
</script>

<template>
  <div class="blog-wrapper">
    <div class="blog-container" :class="{ 'no-avatar': !theme.avatar }">
      <BlogNav v-if="!theme.avatar" is-local />

      <TransitionFadeSlideY>
        <component :is="com[type]" />
      </TransitionFadeSlideY>

      <BlogAside />
      <BlogExtract />
    </div>
  </div>
</template>

<style scoped>
.blog-wrapper {
  position: relative;
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

.blog-container.no-avatar {
  display: block;
  max-width: 784px;
  padding-right: 24px;
}

@media (min-width: 768px) {
  .blog-wrapper {
    min-height: calc(100vh + var(--vp-nav-height) - var(--vp-footer-height, 0px));
  }

  .blog-wrapper {
    padding-top: var(--vp-nav-height);
    margin-top: calc(var(--vp-nav-height) * -1);
    background-color: var(--vp-c-bg-alt);
    transition: background-color var(--t-color);
  }

  .blog-container {
    position: relative;
    z-index: 2;
  }
}

@media (min-width: 960px) {
  .blog-wrapper {
    min-height: calc(100vh - var(--vp-footer-height, 0px));
  }

  .blog-container {
    padding-top: 0;
  }
}

@media (min-width: 1440px) {
  .blog-container {
    max-width: 1104px;
  }
}
</style>
