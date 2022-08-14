<script lang="ts" setup>
import BlogInfo from '@theme-plume/BlogInfo.vue'
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import PostList from '@theme-plume/PostList.vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PostListRef } from '../composables'
import { usePostAllIndex, useTagList } from '../composables'
import { normalizePath } from '../utils'

const tagList = useTagList()
const route = useRoute()
const router = useRouter()
const postList: PostListRef = ref([])
const postAllList = usePostAllIndex()
const currentTag = computed(() => {
  return route.query.tag || ''
})

watch(
  [currentTag, route],
  ([nowTag]) => {
    if (nowTag) {
      postList.value = postAllList.value.filter((post) => {
        return post.tags.some((tag) => normalizePath(tag) === nowTag)
      })
    } else {
      postList.value = []
    }
  },
  { immediate: true }
)

const handleTag = (tag: string): void => {
  router.replace({
    path: route.path,
    query: { tag: normalizePath(tag) },
  })
}
</script>
<template>
  <main class="tag-wrapper">
    <div class="tag-container">
      <div class="tag-content">
        <DropdownTransition>
          <section class="tag-list">
            <span
              v-for="{ tag, color } in tagList"
              :key="tag"
              class="tag"
              :style="{ 'background-color': color }"
              @click="handleTag(tag)"
              >{{ tag }}</span
            >
          </section>
        </DropdownTransition>
        <PostList :post-list="postList"></PostList>
      </div>
      <BlogInfo></BlogInfo>
    </div>
  </main>
</template>
<style lang="scss">
@import '../styles/_mixins';

.tag-wrapper {
  @include wrapper;

  .tag-container {
    @include container_wrapper;
    display: flex;
    align-items: flex-start;
    padding: 1.25rem 0;
  }

  .tag-content {
    flex: 1;
  }

  .tag-list {
    width: 100%;
    padding: 0 1.25rem 0.75rem;
    margin: 0 -0.25rem;

    .tag {
      height: 1.75rem;
      font-size: 16px;
      line-height: 1.75rem;
      display: inline-block;
      padding: 0 0.75rem;
      border-radius: 0.85rem;
      margin: 0 0.25rem 0.5rem;
      background-color: var(--c-bg-lighter);
      cursor: pointer;
      color: #fff;
      // box-shadow: var(--shadow-sm);
    }
  }
}
</style>
