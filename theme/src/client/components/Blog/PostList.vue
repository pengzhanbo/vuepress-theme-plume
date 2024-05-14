<script lang="ts" setup>
import { usePostListControl } from '../../composables/index.js'
import TransitionDrop from '../TransitionDrop.vue'
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
    <template v-for="(post, index) in postList" :key="post.path">
      <TransitionDrop appear :delay="index * 0.04">
        <PostItem
          :key="post.path"
          :post="post"
        />
      </TransitionDrop>
    </template>
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
  padding-top: 32px;
  padding-bottom: 64px;
  margin: 0 auto;
}
</style>
