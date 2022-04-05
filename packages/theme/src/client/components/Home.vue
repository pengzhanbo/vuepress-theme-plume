<script lang="ts" setup>
import BlogInfo from '@theme-plume/BlogInfo.vue'
import HomeBigBanner from '@theme-plume/HomeBigBanner.vue'
import PostList from '@theme-plume/PostList.vue'
</script>
<template>
  <div class="plume-theme-home">
    <HomeBigBanner></HomeBigBanner>
    <div class="plume-theme-container">
      <PostList></PostList>
      <BlogInfo></BlogInfo>
    </div>
  </div>
</template>
<style lang="scss">
@import '../styles/_mixins';
.plume-theme-home {
  @include wrapper;

  .plume-theme-container {
    @include container_wrapper;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1.25rem 0;
  }
}
</style>
