<script lang="ts" setup>
import BlogAvatar from './BlogAvatar.vue'
import PostList from './PostList.vue'
</script>
<template>
  <div class="blog-wrapper">
    <PostList />
    <BlogAvatar />
  </div>
</template>

<style scoped>
.blog-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
  padding-top: var(--vp-nav-height);
}

@media (min-width: 960px) {
  .blog-wrapper {
    max-width: 784px;
    padding-top: 0;
  }
}

@media (min-width: 1440px) {
  .blog-wrapper {
    max-width: 1104px;
  }
}
</style>
