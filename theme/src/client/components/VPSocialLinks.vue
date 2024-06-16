<script lang="ts" setup>
import VPSocialLink from '@theme/VPSocialLink.vue'
import type { SocialLink as SocialLinkType } from '../../shared/index.js'

defineProps<{
  links: SocialLinkType[]
}>()
</script>

<template>
  <div class="vp-social-links">
    <VPSocialLink
      v-for="{ link, icon } in links"
      :key="link"
      :icon="icon"
      :link="link"
    />
  </div>
</template>

<style scoped>
.vp-social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
