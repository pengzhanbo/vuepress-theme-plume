<script lang="ts" setup>
import CategoryGroup from '@theme/CategoryGroup.vue'
import { useCategoryList } from '../composables'

const categoryList = useCategoryList()
</script>
<template>
  <div class="category-wrapper">
    <div class="category-container">
      <h2 class="category-header">栏目</h2>
      <CategoryGroup
        v-for="(category, index) in categoryList"
        :key="index"
        :category="category"
      />
    </div>
  </div>
</template>
