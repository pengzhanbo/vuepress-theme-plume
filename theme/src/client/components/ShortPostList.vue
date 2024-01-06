<script lang="ts" setup>
import AutoLink from './AutoLink.vue'

defineProps<{
  postList: {
    title: string
    path: string
    createTime: string
  }[]
}>()
</script>

<template>
  <ul class="post-list">
    <li v-for="post in postList" :key="post.path">
      <p class="post-title">
        <AutoLink class="post-link" :href="post.path">
          {{ post.title }}
        </AutoLink>
      </p>
      <span class="post-time">{{ post.createTime }}</span>
    </li>
  </ul>
</template>

<style scoped>
.post-list {
  padding: 0 12px;
  margin-top: 32px;
}

.post-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0;
  color: var(--vp-c-text-1);
}

.post-list .post-title {
  display: -webkit-box;
  flex: 1;
  margin-right: 14px;
  overflow: hidden;
  font-weight: 600;
  transition: all var(--t-color);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.post-list .post-time {
  color: var(--vp-c-text-3);
  transition: all var(--t-color);
}

.post-list li:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-list li:hover .post-time {
  color: var(--vp-c-text-2);
}
</style>
