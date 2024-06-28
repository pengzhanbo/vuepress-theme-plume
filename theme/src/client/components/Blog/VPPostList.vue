<script lang="ts" setup>
import VPTransitionDrop from '@theme/VPTransitionDrop.vue'
import VPPostItem from '@theme/Blog/VPPostItem.vue'
import VPPagination from '@theme/Blog/VPPagination.vue'
import { usePostListControl } from '../../composables/blog-post-list.js'

const {
  postList,
  page,
  totalPage,
  pageRange,
  isLastPage,
  isFirstPage,
  isPaginationEnabled,
  changePage,
} = usePostListControl()
</script>

<template>
  <div class="vp-blog-post-list">
    <slot name="blog-post-list-before" />
    <template v-for="(post, index) in postList" :key="post.path">
      <VPTransitionDrop appear :delay="index * 0.025">
        <VPPostItem
          :key="post.path"
          :post="post"
        />
      </VPTransitionDrop>
    </template>
    <slot name="blog-post-list-after" />
    <VPPagination
      v-if="isPaginationEnabled"
      :page="page"
      :total-page="totalPage"
      :page-range="pageRange"
      :is-last-page="isLastPage"
      :is-first-page="isFirstPage"
      @change="changePage"
    />
    <slot name="blog-post-list-pagination-after" />
  </div>
</template>

<style scoped>
.vp-blog-post-list {
  flex: 1;
  padding-top: 32px;
  padding-bottom: 36px;
  margin: 0 auto;
}
</style>
