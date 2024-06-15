<script lang="ts" setup>
import { computed } from 'vue'
import { useData } from '../../composables/data.js'
import VPSocialLinks from '../VPSocialLinks.vue'

const { theme } = useData()

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
  <VPSocialLinks
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
