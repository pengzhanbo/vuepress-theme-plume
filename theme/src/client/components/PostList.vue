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
  padding-top: 2rem;
  flex: 1;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1.25rem 4rem;
}

.btn {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  border: 1px solid var(--vp-c-brand-1);
  padding: 0 4px;
  border-radius: 4px;
  transition: all var(--t-color);
}

.btn:hover {
  color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}
.btn[disabled] {
  color: var(--vp-c-gray-1);
  border-color: var(--vp-c-divider);
}

.page-info {
  color: var(--vp-c-brand-2);
  font-weight: 500;
}
</style>
