<script lang="ts" setup>
import { usePageLang } from '@vuepress/client'
import { useBlogPostData } from '@vuepress-plume/plugin-blog-data/client'
import { computed } from 'vue'
import type { Ref } from 'vue'
import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import PostItem from './PostItem.vue'

const locale = usePageLang()

const list = useBlogPostData() as unknown as Ref<PlumeThemeBlogPostItem[]>

const postList = computed(() => {
  const stickyList = list.value.filter((item) =>
    typeof item.sticky === 'boolean' ? item.sticky : item.sticky >= 0
  )
  const otherList = list.value.filter(
    (item) => item.sticky === undefined || item.sticky === false
  )

  return [
    ...stickyList.sort((prev, next) => {
      if (next.sticky === true && prev.sticky === true) return 0
      return next.sticky > prev.sticky ? 1 : -1
    }),
    ...otherList,
  ].filter((item) => item.lang === locale.value)
})
</script>
<template>
  <div class="post-list">
    <PostItem v-for="post in postList" :key="post.path" :post="post" />
  </div>
</template>

<style scoped>
.post-list {
  padding-top: 2rem;
  flex: 1;
}
</style>
