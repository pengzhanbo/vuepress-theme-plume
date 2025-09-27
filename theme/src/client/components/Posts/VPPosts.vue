<script lang="ts" setup>
import VPPostList from '@theme/Posts/VPPostList.vue'
import VPPostsArchives from '@theme/Posts/VPPostsArchives.vue'
import VPPostsAside from '@theme/Posts/VPPostsAside.vue'
import VPPostsCategories from '@theme/Posts/VPPostsCategories.vue'
import VPPostsExtract from '@theme/Posts/VPPostsExtract.vue'
import VPPostsNav from '@theme/Posts/VPPostsNav.vue'
import VPPostsTags from '@theme/Posts/VPPostsTags.vue'
import VPTransitionFadeSlideY from '@theme/VPTransitionFadeSlideY.vue'
import { watch } from 'vue'
import { forceUpdateCollection, useData } from '../../composables/index.js'

const props = defineProps<{
  homePosts?: boolean
  type?: string
  onlyOnce?: boolean
  collection?: string
}>()

const { theme, page } = useData()

watch(
  () => [props.homePosts, props.collection],
  () => forceUpdateCollection(props.homePosts ? (props.collection || true) : undefined),
  { immediate: true },
)
</script>

<template>
  <div class="vp-posts" :class="{ 'home-posts': homePosts }" vp-posts>
    <slot name="posts-top" />

    <div
      class="posts-container"
      :class="{ 'no-profile': !theme.profile, 'left': theme.profile?.layout === 'left' }"
    >
      <VPPostsNav v-if="!theme.profile" is-local />

      <VPTransitionFadeSlideY>
        <VPPostsArchives v-if="page.type === 'posts-archives'">
          <template #posts-archives-before>
            <slot name="posts-archives-before" />
          </template>
          <template #posts-archives-after>
            <slot name="posts-archives-after" />
          </template>
        </VPPostsArchives>
        <VPPostsTags v-else-if="page.type === 'posts-tags'">
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
        </VPPostsTags>
        <VPPostsCategories v-else-if="page.type === 'posts-categories'">
          <template #posts-categories-before>
            <slot name="posts-categories-before" />
          </template>
          <template #posts-categories-after>
            <slot name="posts-categories-after" />
          </template>
          <template #posts-categories-content-before>
            <slot name="posts-categories-content-before" />
          </template>
        </VPPostsCategories>
        <VPPostList v-else :home-posts="homePosts">
          <template #posts-post-list-before>
            <slot name="posts-post-list-before" />
          </template>
          <template #posts-post-list-after>
            <slot name="posts-post-list-after" />
          </template>
          <template #posts-post-list-pagination-after>
            <slot name="posts-post-list-pagination-after" />
          </template>
        </VPPostList>
      </VPTransitionFadeSlideY>

      <VPPostsAside>
        <template #posts-aside-top>
          <slot name="posts-aside-top" />
        </template>
        <template #posts-aside-bottom>
          <slot name="posts-aside-bottom" />
        </template>
      </VPPostsAside>
      <VPPostsExtract>
        <template #posts-extract-before>
          <slot name="posts-extract-before" />
        </template>
        <template #posts-extract-after>
          <slot name="posts-extract-after" />
        </template>
      </VPPostsExtract>
    </div>

    <slot name="posts-bottom" />
  </div>
</template>

<style scoped>
.vp-posts {
  position: relative;
  min-height: calc(100vh - var(--vp-footer-height, 0px));
  padding: calc(var(--vp-nav-height) + 32px) 16px 32px;
  transition: background-color var(--vp-t-color);
}

.vp-posts.home-posts {
  padding: 32px 16px;
  background-color: var(--vp-c-bg-alt);
}

.posts-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
}

.posts-container:not(.no-profile).left {
  flex-direction: row-reverse;
}

.posts-container.no-profile {
  display: block;
  max-width: 784px;
}

@media (min-width: 768px) {
  .posts-container {
    position: relative;
    z-index: 2;
  }
}

@media (min-width: 960px) {
  .vp-posts {
    min-height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
    padding: 32px 24px;
  }
}

@media (min-width: 1440px) {
  .posts-container {
    max-width: 1104px;
  }
}
</style>
