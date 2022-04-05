<script lang="ts" setup>
import BlogInfo from '@theme-plume/BlogInfo.vue'
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import { useCategoryList } from '../composables'
import CategoryGroup from './CategoryGroup.vue'

const categoryList = useCategoryList()
</script>
<template>
  <div class="category-wrapper">
    <div class="category-container">
      <DropdownTransition>
        <div class="category-content">
          <CategoryGroup
            v-for="(category, index) in categoryList"
            :key="category.type + '_' + index"
            :category="category"
            :index="index"
          />
        </div>
      </DropdownTransition>
      <BlogInfo></BlogInfo>
    </div>
  </div>
</template>
<style lang="scss">
@import '../styles/_mixins';

.category-wrapper {
  @include wrapper;

  .category-container {
    @include container_wrapper;
    display: flex;
    align-items: flex-start;
    padding: 1.25rem 0;
  }

  .category-content {
    flex: 1;
  }
}
</style>
