<script lang="ts" setup>
import { usePostListControl } from '../../composables/index.js'
import PostItem from './PostItem.vue'
import Pagination from './Pagination.vue'

const {
  pagination,
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
  <div class="post-list">
    <PostItem
      v-for="post in postList"
      :key="post.path"
      :post="post"
    />
    <Pagination
      v-if="isPaginationEnabled"
      :pagination="pagination"
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
.post-list {
  flex: 1;
  padding-top: 2rem;
  margin: 0 auto;
}
</style>
