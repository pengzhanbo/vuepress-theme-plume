<script lang="ts" setup>
import { useThemeLocaleData } from '../../composables/index.js'
import SocialLinks from '../SocialLinks.vue'

const theme = useThemeLocaleData()
</script>

<template>
  <SocialLinks
    v-if="theme.social"
    class="navbar-social-links"
    :links="theme.social"
  />
</template>

<style scoped>
.navbar-social-links {
  display: none;
}

@media (width >= 1280px) {
  .navbar-social-links {
    display: flex;
    align-items: center;
  }
}
</style>
