<script lang="ts" setup>
import VPSocialLinks from '@theme/VPSocialLinks.vue'
import { computed } from 'vue'
import { useData } from '../../composables/index.js'

const { theme } = useData()

const social = computed(() => {
  const includes = theme.value.navbarSocialInclude ?? []
  if (!includes.length)
    return theme.value.social

  return theme.value.social?.filter(({ icon }) => {
    if (typeof icon === 'string')
      return includes.includes(icon)
    if (icon.name)
      return includes.includes(icon.name)
    return false
  })
})
</script>

<template>
  <VPSocialLinks
    v-if="social"
    class="vp-navbar-social-links"
    :links="social"
  />
</template>

<style scoped>
.vp-navbar-social-links {
  display: none;
}

@media (min-width: 1280px) {
  .vp-navbar-social-links {
    display: flex;
    align-items: center;
  }
}
</style>
