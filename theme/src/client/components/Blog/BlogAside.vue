<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import BlogNav from './BlogNav.vue'
import BlogProfile from './BlogProfile.vue'

const { theme } = useData()
</script>

<template>
  <div v-if="theme.avatar" class="blog-aside-wrapper">
    <BlogProfile />
    <BlogNav />
  </div>
</template>

<style scoped>
.blog-aside-wrapper {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
  display: none;
  width: 270px;
  overflow-y: auto;
  text-align: center;
}

@media (min-width: 768px) {
  .blog-aside-wrapper {
    display: block;
    margin: 2rem 1rem 1rem 1.5rem;
  }
}
</style>
