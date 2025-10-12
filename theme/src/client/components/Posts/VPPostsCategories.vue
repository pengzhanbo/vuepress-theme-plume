<script setup lang="ts">
import VPCategories from '@theme/Posts/VPCategories.vue'
import { useInternalLink, usePostsCategory } from '../../composables/index.js'

const { categories: categoriesLink } = useInternalLink()
const { categories } = usePostsCategory()
</script>

<template>
  <div class="vp-post-categories">
    <slot name="posts-categories-before" />

    <h2 class="categories-title">
      <span class="vpi-category icon" />
      <span>{{ categoriesLink?.text ?? 'Categories' }}</span>
    </h2>

    <slot name="posts-categories-content-before" />

    <div class="content">
      <VPCategories :items="categories" :depth="0" />
    </div>

    <slot name="posts-categories-after" />
  </div>
</template>

<style scoped>
.vp-post-categories {
  flex: 1 2;
  padding: 16px;
  margin: 0 -16px 32px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color), box-shadow var(--vp-t-color);
}

@media (min-width: 768px) {
  .vp-post-categories {
    padding: 20px 24px;
    margin: 0 0 32px;
    background-color: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
  }

  .vp-post-categories:hover {
    box-shadow: var(--vp-shadow-2);
  }
}

.categories-title {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
  margin: 0 -16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border-bottom: solid 1px var(--vp-c-divider);
  transition: color var(--vp-t-color), border-color var(--vp-t-color);
}

.categories-title .icon {
  margin-right: 8px;
}

@media (min-width: 768px) {
  .categories-title {
    padding: 0 24px 12px;
    margin: 0 -24px;
    border-bottom: solid 1px var(--vp-c-divider);
    transition: border-bottom var(--vp-t-color);
  }
}

@media (min-width: 1200px) {
  .vp-post-categories {
    margin-left: 0;
  }
}

.vp-post-categories .content {
  padding: 20px 0 0;
}
</style>
