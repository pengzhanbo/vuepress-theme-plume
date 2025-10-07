<script lang="ts" setup>
import VPPostsNav from '@theme/Posts/VPPostsNav.vue'
import VPPostsProfile from '@theme/Posts/VPPostsProfile.vue'
import { useData } from '../../composables/index.js'

const { theme } = useData()
</script>

<template>
  <div v-if="theme.profile" class="vp-posts-aside">
    <slot name="posts-aside-top" />
    <VPPostsProfile />
    <VPPostsNav />
    <slot name="posts-aside-bottom" />
  </div>
</template>

<style scoped>
.vp-posts-aside {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
  display: none;
  width: 270px;
  text-align: center;
}

@media (min-width: 768px) {
  .vp-posts-aside {
    display: block;
  }
}
</style>
