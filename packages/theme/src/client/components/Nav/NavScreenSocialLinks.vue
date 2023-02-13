<script lang="ts" setup>
import { useThemeData } from '../../composables/index.js'
import SocialLinks from '../SocialLinks.vue'

const theme = useThemeData()
</script>

<template>
  <SocialLinks
    v-if="theme.social"
    class="VPNavScreenSocialLinks"
    :links="theme.social"
  />
</template>
