<script setup lang="ts">
import VPCategories from '@theme/Blog/VPCategories.vue'
import { useBlogCategory, useBlogNavTitle } from '../../composables/index.js'

const title = useBlogNavTitle('category')
const { categories } = useBlogCategory()
</script>

<template>
  <div class="vp-blog-categories">
    <slot name="blog-categories-before" />

    <h2 class="categories-title">
      <span class="vpi-category icon" />
      <span>{{ title }}</span>
    </h2>

    <div class="content">
      <VPCategories :items="categories" />
    </div>

    <slot name="blog-categories-after" />
  </div>
</template>

<style scoped>
.vp-blog-categories {
  flex: 1;
  padding: 32px 0;
  margin: 0 auto;
  transition: background-color var(--t-color), box-shadow var(--t-color);
}

@media (min-width: 768px) {
  .vp-blog-categories {
    padding: 20px 0;
    margin: 32px auto 32px 20px;
    background-color: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
  }

  .vp-blog-categories:hover {
    box-shadow: var(--vp-shadow-2);
  }
}

.categories-title {
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.categories-title .icon {
  margin-right: 8px;
}

@media (min-width: 768px) {
  .categories-title {
    padding-bottom: 20px;
    margin-top: 0;
    border-bottom: solid 1px var(--vp-c-divider);
    transition: border-bottom var(--t-color);
  }
}

@media (min-width: 1200px) {
  .vp-blog-categories {
    margin-left: 0;
  }
}

.vp-blog-categories .content {
  padding: 20px 20px 0;
}
</style>
