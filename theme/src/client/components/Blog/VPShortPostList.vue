<script lang="ts" setup>
import VPLink from '@theme/VPLink.vue'

defineProps<{
  postList: {
    title: string
    path: string
    createTime: string
  }[]
}>()
</script>

<template>
  <ul class="vp-blog-short-post-list">
    <li v-for="post in postList" :key="post.path">
      <p class="post-title">
        <VPLink class="post-link" :href="post.path">
          {{ post.title }}
        </VPLink>
      </p>
      <span class="post-time">{{ post.createTime }}</span>
    </li>
  </ul>
</template>

<style scoped>
.vp-blog-short-post-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
}

.vp-blog-short-post-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-blog-short-post-list .post-title {
  display: -webkit-box;
  flex: 1;
  margin-right: 14px;
  overflow: hidden;
  font-weight: 600;
  transition: all var(--vp-t-color);

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.vp-blog-short-post-list .post-time {
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.vp-blog-short-post-list li:hover .post-title {
  color: var(--vp-c-brand-1);
}

.vp-blog-short-post-list li:hover .post-time {
  font-weight: 500;
  color: var(--vp-c-text-1);
}
</style>
