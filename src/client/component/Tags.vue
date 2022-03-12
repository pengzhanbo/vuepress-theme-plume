<script lang="ts" setup>
import PostList from '@theme/PostList.vue'
import TagSidebar from '@theme/TageSidebar.vue'
</script>
<template>
  <div class="tags-wrapper">
    <div class="tags-container">
      <PostList class="flex-1" />
      <div class="right-sidebar-container">
        <TagSidebar></TagSidebar>
      </div>
    </div>
  </div>
</template>
