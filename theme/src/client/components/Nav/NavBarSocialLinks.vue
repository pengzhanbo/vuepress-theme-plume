<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeLocaleData } from '../../composables/index.js'
import SocialLinks from '../SocialLinks.vue'

const theme = useThemeLocaleData()

const social = computed(() => {
  const includes = theme.value.navbarSocialInclude ?? []
  if (!includes.length)
    return theme.value.social

  return theme.value.social?.filter(
    ({ icon }) => typeof icon === 'string' && includes.includes(icon),
  )
})
</script>

<template>
  <SocialLinks
    v-if="social"
    class="navbar-social-links"
    :links="social"
  />
</template>

<style scoped>
.navbar-social-links {
  display: none;
}

@media (min-width: 1280px) {
  .navbar-social-links {
    display: flex;
    align-items: center;
  }
}
</style>
