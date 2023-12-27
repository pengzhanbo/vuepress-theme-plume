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
  <div class="post-list">
    <p v-for="post in postList" :key="post.path">
      <AutoLink class="post-title" :href="post.path">
        {{ post.title }}
      </AutoLink>
      <span class="post-time">{{ post.createTime }}</span>
    </p>
  </div>
</template>

<style scoped>
.post-list {
  margin-top: 32px;
  padding: 0 12px;
}

.post-list p {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0;
  color: var(--vp-c-text-1);
}

.post-list .post-title {
  flex: 1;
  margin-right: 20px;
  font-weight: 600;
  transition: all var(--t-color);
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.post-list .post-time {
  color: var(--vp-c-text-3);
  transition: all var(--t-color);
}

.post-list p:hover .post-title {
  color: var(--vp-c-brand-1);
}
.post-list p:hover .post-time {
  color: var(--vp-c-text-2);
}
</style>
