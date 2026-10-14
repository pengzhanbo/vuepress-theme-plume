<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '../../composables/index.js'

const { page, isFirstPage, isLastPage, pageRange } = defineProps<{
  page: number
  totalPage: number
  isFirstPage: boolean
  isLastPage: boolean
  pageRange: { value: number | string, more?: true }[]
}>()
const emit = defineEmits<{ change: [value: number] }>()

const { theme } = useData()

const paginationLabel = computed(() => theme.value.paginationLabel || 'Pagination')
</script>

<template>
  <nav class="vp-pagination" :aria-label="paginationLabel">
    <button
      type="button"
      class="btn prev"
      :disabled="isFirstPage"
      @click="() => emit('change', page - 1)"
    >
      {{ theme.prevPageLabel || 'Prev' }}
    </button>
    <div class="page-range">
      <template v-for="{ value, more } in pageRange" :key="value">
        <span v-if="more" class="btn more" aria-hidden="true">…</span>
        <button
          v-else
          class="btn"
          :class="{ active: value === page }"
          :aria-current="value === page ? 'page' : undefined"
          type="button"
          @click="() => emit('change', value as number)"
        >
          {{ value }}
        </button>
      </template>
    </div>
    <button
      type="button"
      class="btn next"
      :disabled="isLastPage"
      @click="() => emit('change', page + 1)"
    >
      {{ theme.nextPageLabel || 'Next' }}
    </button>
  </nav>
</template>

<style scoped>
.vp-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin: 0 -16px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.btn {
  padding: 2px 5px;
  margin: 0 2px;
  font-weight: 500;
  line-height: 1;
  color: var(--vp-c-text-2);
  background-color: transparent;
  border-radius: 4px;
  transition: var(--vp-t-color);
  transition-property: color, background-color;
}

.btn.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-alt);
}

.btn[disabled],
.btn[disabled]:hover {
  color: var(--vp-c-gray-1);
  cursor: not-allowed;
  background-color: transparent;
}

.btn.more {
  color: var(--vp-c-gray-1);
  cursor: default;
  background-color: transparent;
}

@media (min-width: 768px) {
  .vp-pagination {
    margin: 0;
    background-color: var(--vp-c-bg);
    border-radius: 6px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: background-color, box-shadow;
  }

  .page-range .btn {
    padding: 4px 12px;
    margin: 0 8px;
    font-size: 14px;
  }

  .btn:not(.active, [disabled], .more):hover {
    color: var(--vp-c-brand-1);
  }

  .btn:not(.prev, .next):hover {
    background-color: var(--vp-c-bg-alt);
  }
}

@media (min-width: 1200px) {
  .vp-pagination {
    margin-left: 0;
  }
}
</style>
