<script lang="ts" setup>
import BloggerInfo from './BloggerInfo.vue'
</script>
<template>
  <aside class="blog-info-wrapper">
    <BloggerInfo />
  </aside>
</template>
<style lang="scss">
@import '../styles/variables';
.blog-info-wrapper {
  width: 18.75rem;
  margin-left: 1.25rem;
  position: sticky;
  top: calc(var(--navbar-height) + 1.25rem);
}

@media (max-width: $MQMobile) {
  .blog-info-wrapper {
    display: none;
  }
}
</style>
