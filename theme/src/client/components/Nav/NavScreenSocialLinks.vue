<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import SocialLinks from '../SocialLinks.vue'

const { theme } = useData()
</script>

<template>
  <SocialLinks
    v-if="theme.social"
    class="VPNavScreenSocialLinks"
    :links="theme.social"
  />
</template>
