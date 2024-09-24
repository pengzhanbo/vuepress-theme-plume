<script lang="ts" setup>
import VPBlogArchives from '@theme/Blog/VPBlogArchives.vue'
import VPBlogAside from '@theme/Blog/VPBlogAside.vue'
import VPBlogCategories from '@theme/Blog/VPBlogCategories.vue'
import VPBlogExtract from '@theme/Blog/VPBlogExtract.vue'
import VPBlogNav from '@theme/Blog/VPBlogNav.vue'
import VPBlogTags from '@theme/Blog/VPBlogTags.vue'
import VPPostList from '@theme/Blog/VPPostList.vue'
import VPTransitionFadeSlideY from '@theme/VPTransitionFadeSlideY.vue'
import { useData } from '../../composables/index.js'

defineProps<{
  homeBlog?: boolean
  type?: string
  onlyOnce?: boolean
}>()

const { theme, page } = useData()
</script>

<template>
  <div class="vp-blog" :class="{ 'home-blog': homeBlog }" vp-blog>
    <slot name="blog-top" />

    <div
      class="blog-container"
      :class="{ 'no-profile': !theme.profile, 'left': theme.profile?.layout === 'left' }"
    >
      <VPBlogNav v-if="!theme.profile" is-local />

      <VPTransitionFadeSlideY>
        <VPBlogArchives v-if="page.type === 'blog-archives'">
          <template #blog-archives-before>
            <slot name="blog-archives-before" />
          </template>
          <template #blog-archives-after>
            <slot name="blog-archives-after" />
          </template>
        </VPBlogArchives>
        <VPBlogTags v-else-if="page.type === 'blog-tags'">
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
        </VPBlogTags>
        <VPBlogCategories v-else-if="page.type === 'blog-categories'">
          <template #blog-categories-before>
            <slot name="blog-categories-before" />
          </template>
          <template #blog-categories-after>
            <slot name="blog-categories-after" />
          </template>
          <template #blog-categories-content-before>
            <slot name="blog-categories-content-before" />
          </template>
        </VPBlogCategories>
        <VPPostList v-else :home-blog="homeBlog">
          <template #blog-post-list-before>
            <slot name="blog-post-list-before" />
          </template>
          <template #blog-post-list-after>
            <slot name="blog-post-list-after" />
          </template>
          <template #blog-post-list-pagination-after>
            <slot name="blog-post-list-pagination-after" />
          </template>
        </VPPostList>
      </VPTransitionFadeSlideY>

      <VPBlogAside>
        <template #blog-aside-top>
          <slot name="blog-aside-top" />
        </template>
        <template #blog-aside-bottom>
          <slot name="blog-aside-bottom" />
        </template>
      </VPBlogAside>
      <VPBlogExtract>
        <template #blog-extract-before>
          <slot name="blog-extract-before" />
        </template>
        <template #blog-extract-after>
          <slot name="blog-extract-after" />
        </template>
      </VPBlogExtract>
    </div>

    <slot name="blog-bottom" />
  </div>
</template>

<style scoped>
.vp-blog {
  position: relative;
  min-height: calc(100vh - var(--vp-footer-height, 0px));
  padding: calc(var(--vp-nav-height) + 32px) 16px 32px;
  transition: background-color var(--vp-t-color);
}

.vp-blog.home-blog {
  padding: 32px 16px;
  background-color: var(--vp-c-bg-alt);
}

.blog-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
}

.blog-container:not(.no-profile).left {
  flex-direction: row-reverse;
}

.blog-container.no-profile {
  display: block;
  max-width: 784px;
}

@media (min-width: 768px) {
  .blog-container {
    position: relative;
    z-index: 2;
  }
}

@media (min-width: 960px) {
  .vp-blog {
    min-height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
    padding: 32px 24px;
  }
}

@media (min-width: 1440px) {
  .blog-container {
    max-width: 1104px;
  }
}
</style>
