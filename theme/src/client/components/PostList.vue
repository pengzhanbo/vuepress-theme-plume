<script lang="ts" setup>
import { usePostListControl } from '../composables/index.js'
import PostItem from './PostItem.vue'

const {
  pagination,
  postList,
  page,
  totalPage,
  isLastPage,
  isFirstPage,
  isPaginationEnabled,
  changePage,
} = usePostListControl()
</script>

<template>
  <div class="post-list">
    <PostItem v-for="post in postList" :key="post.path" :post="post" />
    <div v-if="isPaginationEnabled" class="pagination">
      <button type="button" class="btn prev" :disabled="isFirstPage" @click="() => changePage(-1)">
        {{ pagination?.prevPageText || 'Prev' }}
      </button>
      <span class="page-info">{{ page }} / {{ totalPage }}</span>
      <button type="button" class="btn next" :disabled="isLastPage" @click="() => changePage(1)">
        {{ pagination?.nextPageText || 'Next' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  flex: 1;
  padding-top: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1.25rem 4rem;
}

.btn {
  padding: 0 4px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px;
  transition: all var(--t-color);
}

.btn:hover {
  color: var(--vp-c-bg);
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.btn[disabled],
.btn[disabled]:hover {
  color: var(--vp-c-gray-1);
  cursor: not-allowed;
  background-color: transparent;
  border-color: var(--vp-c-divider);
}

.page-info {
  font-weight: 500;
  color: var(--vp-c-text-3);
}
</style>
