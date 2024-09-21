<script setup lang="ts">
import type { PlumeThemeHomeProfile } from '../../../shared/index.js'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import VPImage from '@theme/VPImage.vue'
import { computed } from 'vue'
import { useData } from '../../composables/index.js'

const props = defineProps<PlumeThemeHomeProfile>()

const { theme } = useData()

const rawProfile = computed(() => theme.value.profile)

const profile = computed(() => {
  return {
    name: props.name || rawProfile.value?.name,
    description: props.description || rawProfile.value?.description,
    avatar: props.avatar || rawProfile.value?.avatar || rawProfile.value?.url,
    circle: props.circle || rawProfile.value?.circle,
  }
})
</script>

<template>
  <VPHomeBox
    class="vp-home-profile"
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
  >
    <VPImage v-if="profile.avatar" :image="profile.avatar" :class="{ circle: profile.circle }" />

    <h3 v-if="profile.name" v-html="profile.name" />

    <p v-if="profile.description" v-html="profile.description" />
  </VPHomeBox>
</template>

<style scoped>
.vp-home-profile :deep(.container) {
  overflow: hidden;
}

.vp-home-profile :deep(img) {
  float: left;
  width: 64px;
  margin-right: 24px;
}

.vp-home-profile :deep(img.circle) {
  border-radius: 50%;
}

@media (min-width: 960px) {
  .vp-home-profile :deep(img) {
    width: 96px;
  }
}

.vp-home-profile :deep(h3) {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
}

.vp-home-profile :deep(p) {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  transition: color var(--vp-t-color);
}
</style>
