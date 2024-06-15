<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import VPSocialLinks from '../VPSocialLinks.vue'

const { theme } = useData()
</script>

<template>
  <VPSocialLinks
    v-if="theme.social"
    class="vp-nav-screen-social-links"
    :links="theme.social"
  />
</template>
