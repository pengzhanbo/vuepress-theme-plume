<script setup lang="ts">
import type { PlumeThemeBlog } from '../../shared/index.js'

type NonFalseAndNullable<T> = T extends false | null | undefined ? never : T

defineProps<{
  pagination: NonFalseAndNullable<PlumeThemeBlog['pagination']>
  page: number
  totalPage: number
  isFirstPage: boolean
  isLastPage: boolean
  pageRange: { value: number | string, more?: true }[]
}>()
const emit = defineEmits<{ change: [value: number] }>()
</script>

<template>
  <div class="pagination">
    <button
      type="button"
      class="btn prev"
      :disabled="isFirstPage"
      @click="() => emit('change', page - 1)"
    >
      {{ pagination?.prevPageText || 'Prev' }}
    </button>
    <div class="page-range">
      <button
        v-for="{ value, more } in pageRange"
        :key="value"
        class="btn"
        :disabled="more"
        :class="{ more, active: value === page }"
        type="button"
        @click="() => !more && emit('change', value as number)"
      >
        {{ more ? '...' : value }}
      </button>
    </div>
    <button
      type="button"
      class="btn next"
      :disabled="isLastPage"
      @click="() => emit('change', page + 1)"
    >
      {{ pagination?.nextPageText || 'Next' }}
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 20px 24px;
  margin-bottom: 64px;
}

.btn {
  padding: 2px 4px;
  margin: 0 2px;
  font-weight: 500;
  line-height: 1;
  color: var(--vp-c-text-2);
  background-color: transparent;
  border-radius: 4px;
  transition: var(--t-color);
  transition-property: color, background-color;
}

.btn.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-alt);
}

.btn[disabled],
.btn[disabled]:hover,
.btn.more {
  color: var(--vp-c-gray-1);
  cursor: not-allowed;
  background-color: transparent;
}

@media (min-width: 768px) {
  .pagination {
    padding: 20px;
    background-color: var(--vp-c-bg);
    border-radius: 6px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--t-color);
    transition-property: background-color, box-shadow;
  }

  .page-range .btn {
    padding: 4px 12px;
    margin: 0 8px;
    font-size: 14px;
  }

  .btn:not(.active):hover {
    color: var(--vp-c-brand-1);
  }
}
</style>
