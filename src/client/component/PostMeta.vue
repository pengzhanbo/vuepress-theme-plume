<script lang="ts" setup>
import * as dayjs from 'dayjs'
import { computed, withDefaults } from 'vue'
import type { PostItemIndex } from '../../shared'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    post: PostItemIndex
    type: 'post' | 'postItem'
  }>(),
  {}
)

const tags = computed(() => {
  return (props.post.frontmatter.tags || []).filter((_, i) => i < 4)
})

const formatDate = (date: number | Date | string | undefined): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

// const getTags = (post: PostItemIndex): string[] => {
//   const tags = post.frontmatter.tags || []
//   return tags.splice(0, 4)
// }
</script>
<template>
  <div class="post-meta">
    <h2 v-if="type === 'postItem'">
      {{ post.title }}
    </h2>
    <h1 v-else>{{ post.title }}</h1>
  </div>
  <div
    class="post-meta-profile"
    :class="post.excerpt || type === 'post' ? 'post-meta-profile-border' : ''"
  >
    <div class="post-author">
      <Icon type="user" size="sm" class="mr-1"></Icon>
      <span>{{ post.frontmatter.author }}</span>
    </div>
    <div class="post-category">
      <Icon type="folder" size="sm" class="mr-1"></Icon>
      <template v-for="(cate, index) in post.category" :key="cate.type">
        <span>
          {{ cate.name }}
        </span>
        <span v-if="index < post.category.length - 1"> / </span>
      </template>
    </div>
    <div v-if="tags && tags.length > 0" class="post-tags">
      <Icon type="tag" size="sm" class="mr-1"></Icon>
      <template v-for="(tag, index) in tags" :key="tag">
        <span>{{ tag }}</span>
        <span v-if="index < tags.length - 1">、</span>
      </template>
    </div>
    <div class="post-createtime">
      <Icon type="clock" size="sm" class="mr-1"></Icon>
      <span>{{ formatDate(post.frontmatter.createTime) }}</span>
    </div>
  </div>
</template>
