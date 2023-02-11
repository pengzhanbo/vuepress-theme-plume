<script lang="ts" setup>
import Page from './Page.vue'
</script>
<template>
  <div class="plume-blog-page">
    <Page />
  </div>
</template>

<style scoped>
.plume-blog-page {
  flex-grow: 1;
  flex-shrink: 0;
  margin: var(--vp-layout-top-height, 0px) auto 0;
  width: 100%;
}

@media (min-width: 960px) {
  .plume-blog-page {
    padding-top: var(--vp-nav-height);
  }

  .plume-blog-page.has-sidebar {
    margin: var(--vp-layout-top-height, 0px) 0 0;
    padding-left: var(--vp-sidebar-width);
  }
}
</style>
