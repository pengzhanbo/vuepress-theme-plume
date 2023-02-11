<script lang="ts" setup>
import type { SocialLink as SocialLinkType } from '../../shared/index.js'
import SocialLink from './SocialLink.vue'

defineProps<{
  links: SocialLinkType[]
}>()
</script>

<template>
  <div class="social-links">
    <SocialLink
      v-for="{ link, icon } in links"
      :key="link"
      :icon="icon"
      :link="link"
    />
  </div>
</template>

<style scoped>
.social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
