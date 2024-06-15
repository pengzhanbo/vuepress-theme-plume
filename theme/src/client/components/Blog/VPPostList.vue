<script lang="ts" setup>
import { usePostListControl } from '../../composables/blog.js'
import VPTransitionDrop from '../VPTransitionDrop.vue'
import VPPostItem from './VPPostItem.vue'
import VPPagination from './VPPagination.vue'

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
    <template v-for="(post, index) in postList" :key="post.path">
      <VPTransitionDrop appear :delay="index * 0.04">
        <VPPostItem
          :key="post.path"
          :post="post"
        />
      </VPTransitionDrop>
    </template>
    <VPPagination
      v-if="isPaginationEnabled"
      :page="page"
      :total-page="totalPage"
      :page-range="pageRange"
      :is-last-page="isLastPage"
      :is-first-page="isFirstPage"
      @change="changePage"
    />
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
