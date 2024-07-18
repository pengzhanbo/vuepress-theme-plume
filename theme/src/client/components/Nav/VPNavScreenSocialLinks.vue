<script lang="ts" setup>
import VPSocialLinks from '@theme/VPSocialLinks.vue'
import { useData } from '../../composables/index.js'

const { theme } = useData()
</script>

<template>
  <VPSocialLinks
    v-if="theme.social"
    class="vp-nav-screen-social-links"
    :links="theme.social"
  />
</template>
