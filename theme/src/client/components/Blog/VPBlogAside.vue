<script lang="ts" setup>
import VPBlogNav from '@theme/Blog/VPBlogNav.vue'
import VPBlogProfile from '@theme/Blog/VPBlogProfile.vue'
import { useData } from '../../composables/data.js'

const { theme } = useData()
</script>

<template>
  <div v-if="theme.profile" class="vp-blog-aside">
    <slot name="blog-aside-top" />
    <VPBlogProfile />
    <VPBlogNav />
    <slot name="blog-aside-bottom" />
  </div>
</template>

<style scoped>
.vp-blog-aside {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
  display: none;
  width: 270px;
  overflow-y: auto;
  text-align: center;
}

@media (min-width: 768px) {
  .vp-blog-aside {
    display: block;
    margin: 2rem 1rem 1rem 1.5rem;
  }
}
</style>
