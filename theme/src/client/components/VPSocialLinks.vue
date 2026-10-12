<script lang="ts" setup>
import type { SocialLink as SocialLinkType } from '../../shared/index.js'
import VPSocialLink from '@theme/VPSocialLink.vue'

const { links } = defineProps<{
  links: SocialLinkType[]
}>()
</script>

<template>
  <div class="vp-social-links">
    <VPSocialLink
      v-for="item in links"
      :key="item.link"
      :icon="item.icon"
      :link="item.link"
      :aria-label="item.ariaLabel"
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
