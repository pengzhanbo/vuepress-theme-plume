<script lang="ts" setup>
import VPPagination from '@theme/Blog/VPPagination.vue'
import VPPostItem from '@theme/Blog/VPPostItem.vue'
import VPTransitionDrop from '@theme/VPTransitionDrop.vue'
import { computed } from 'vue'
import { usePostListControl } from '../../composables/index.js'

const props = defineProps<{
  homeBlog?: boolean
}>()

const {
  postList,
  page,
  totalPage,
  pageRange,
  isLastPage,
  isFirstPage,
  isPaginationEnabled,
  changePage,
} = usePostListControl(computed(() => !!props.homeBlog))
</script>

<template>
  <div class="vp-blog-post-list">
    <slot name="blog-post-list-before" />
    <template v-for="(post, index) in postList" :key="post.path">
      <VPTransitionDrop appear :delay="index * 0.025">
        <VPPostItem
          :key="post.path"
          :post="post"
          :index="index"
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
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}

@media (min-width: 419px) {
  .vp-blog-post-list {
    gap: 24px;
    padding-bottom: 24px;
  }
}
</style>
