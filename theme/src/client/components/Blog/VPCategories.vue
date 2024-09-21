<script lang="ts" setup>
import type { BlogCategoryItem, BlogCategoryItemWithPost } from '../../composables/index.js'
import VPCategoriesGroup from '@theme/Blog/VPCategoriesGroup.vue'
import VPLink from '@theme/VPLink.vue'

defineProps<{
  items: (BlogCategoryItem | BlogCategoryItemWithPost)[]
}>()
</script>

<template>
  <ul class="vp-categories">
    <li
      v-for="item in items"
      :key="(item as BlogCategoryItemWithPost).path || (item as BlogCategoryItem).id"
      class="vp-categories-item"
    >
      <p v-if="item.type === 'post'" class="post">
        <span class="vpi-post" />
        <VPLink
          :href="item.path"
          :text="item.title"
        />
      </p>
      <VPCategoriesGroup v-else :item="item" />
    </li>
  </ul>
</template>

<style scoped>
.vp-categories-item {
  margin: 8px 0;
  font-size: 16px;
  list-style: none;
}

.vp-categories-item .post {
  display: flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-categories-item .post:hover {
  color: var(--vp-c-brand-1);
}

.vp-categories-item .post .vpi-post {
  display: inline-block;
  width: 1em;
  margin-right: 8px;
}

.vp-categories-item .post :deep(.vp-link) {
  display: -webkit-box;
  overflow: hidden;
}
</style>
