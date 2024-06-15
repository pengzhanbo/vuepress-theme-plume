<script lang="ts" setup>
import { computed } from 'vue'
import { useData } from '../../composables/data.js'
import VPTransitionFadeSlideY from '../VPTransitionFadeSlideY.vue'
import VPPostList from './VPPostList.vue'
import VPBlogArchives from './VPBlogArchives.vue'
import VPBlogAside from './VPBlogAside.vue'
import VPBlogExtract from './VPBlogExtract.vue'
import VPBlogTags from './VPBlogTags.vue'
import VPBlogNav from './VPBlogNav.vue'

const { theme, page } = useData()

const com = {
  VPPostList,
  VPBlogTags,
  VPBlogArchives,
}

const type = computed(() => {
  const type = page.value.type
  if (type === 'blog-tags')
    return 'VPBlogTags'
  if (type === 'blog-archives')
    return 'VPBlogArchives'
  return 'VPPostList'
})
</script>

<template>
  <div class="vp-blog">
    <div class="blog-container" :class="{ 'no-avatar': !theme.avatar }">
      <VPBlogNav v-if="!theme.avatar" is-local />

      <VPTransitionFadeSlideY>
        <component :is="com[type]" />
      </VPTransitionFadeSlideY>

      <VPBlogAside />
      <VPBlogExtract />
    </div>
  </div>
</template>

<style scoped>
.vp-blog {
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
  .vp-blog {
    min-height: calc(100vh + var(--vp-nav-height) - var(--vp-footer-height, 0px));
  }

  .vp-blog {
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
  .vp-blog {
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
