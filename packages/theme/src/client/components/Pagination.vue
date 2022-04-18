<script lang="ts" setup>
import { useOffsetPagination } from '@vueuse/core'
import { computed, ref, toRefs } from 'vue'

const emit = defineEmits(['togglePage'])
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
const { page, total } = toRefs(props)

function handlePage({ currentPage }): void {
  emit('togglePage', currentPage)
}
const { currentPage, pageCount, isFirstPage, isLastPage, prev, next } =
  useOffsetPagination({
    total: total.value,
    page: page.value,
    pageSize: 10,
    onPageChange: handlePage,
    onPageCountChange: handlePage,
  })

const pageList = computed(() => {
  const list: (number | '')[] = []
  const count = pageCount.value
  const current = currentPage.value
  if (count <= 3 || current <= 2) {
    new Array(Math.min(3, count)).fill(0).forEach((_, i) => list.push(i + 1))
    if (count > 3) {
      list.push('')
      list.push(count)
    }
  } else if (current > count - 2) {
    list.push(1)
    list.push('')
    new Array(3).fill(count - 2).forEach((_, i) => list.push(_ + i))
  } else {
    list.push(1)
    current > 3 && list.push('')
    ;[current - 1, current, current + 1].forEach((page: number) =>
      list.push(page)
    )
    current < count - 2 && list.push('')
    list.push(count)
  }
  return list
})

const inputPage = ref(1)
function handleJump(): void {
  if (
    inputPage.value &&
    inputPage.value >= 1 &&
    inputPage.value <= pageCount.value &&
    currentPage.value !== Number(inputPage.value)
  ) {
    currentPage.value = Number(inputPage.value)
    emit('togglePage', inputPage.value)
  }
}
</script>
<template>
  <div v-if="pageCount > 1" class="pagination-wrapper">
    <div class="pagination-container">
      <button
        type="button"
        class="btn-prev"
        :disabled="isFirstPage"
        @click="prev"
      >
        prev
      </button>
      <template v-for="count in pageList" :key="count">
        <button
          v-if="count"
          type="button"
          :disabled="count === currentPage"
          @click="currentPage = count"
        >
          {{ count }}
        </button>
        <button v-else type="button" disabled>..</button>
      </template>
      <button
        type="button"
        class="btn-next"
        :disabled="isLastPage"
        @click="next"
      >
        next
      </button>
    </div>
    <div class="pagination-form can-hide">
      <span>跳转到：</span>
      <input v-model="inputPage" type="number" :min="1" :max="pageCount" />
      <span>/{{ pageCount }}</span>
      <button type="button" class="btn-jump" @click="handleJump">确认</button>
    </div>
  </div>
</template>
<style lang="scss">
@import '../styles/variables';
.pagination-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  font-size: 14px;

  .pagination-container {
    flex: 1;

    button {
      border-right: solid 1px var(--c-border);

      &:last-of-type {
        border-right: none;
      }
    }
  }

  button {
    background-color: var(--c-bg-container);
    cursor: pointer;
    font-size: inherit;
    padding: 0 0.8rem;
    height: 34px;
    line-height: 34px;
    border: solid 1px transparent;
    color: var(--c-text);
    box-shadow: var(--shadow-sm);

    &:disabled {
      color: var(--c-text-accent);
      cursor: unset;
    }

    &.btn-prev,
    &.btn-next,
    &.btn-jump {
      color: var(--c-text-accent);

      &:disabled {
        color: var(--c-text);
      }
    }
  }

  .pagination-form {
    input {
      font-size: inherit;
      padding: 0.5rem;
      width: 3.25rem;
      height: 34px;
      line-height: 34px;
      border: solid 1px transparent;
      color: var(--c-text);
      box-shadow: var(--shadow-sm);
      outline: 0;
      margin-right: 0.5rem;

      &:focus {
        border-color: var(--c-brand);
      }
    }

    span {
      margin-right: 0.5rem;
    }
  }
}

@media (max-width: $MQMobile) {
  .pagination-wrapper {
    .can-hide {
      display: none;
    }
    // .pagination-container {
    //   display: flex;
    //   justify-content: space-between;
    //   padding: 0 2rem;
    // }
  }
}
</style>
