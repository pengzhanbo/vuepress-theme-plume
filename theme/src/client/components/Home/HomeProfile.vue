<script setup lang="ts">
import { computed } from 'vue'
import type { PlumeThemeHomeProfile } from '../../../shared/index.js'
import VImage from '../VImage.vue'
import { useData } from '../../composables/data.js'
import HomeBox from './HomeBox.vue'

const props = defineProps<PlumeThemeHomeProfile>()

const { theme } = useData()

const avatar = computed(() => theme.value.avatar)

const profile = computed(() => {
  return {
    name: props.name || avatar.value?.name,
    description: props.description || avatar.value?.description,
    avatar: props.avatar || avatar.value?.url,
    circle: props.circle || avatar.value?.circle,
  }
})
</script>

<template>
  <HomeBox
    class="home-profile"
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
  >
    <VImage v-if="profile.avatar" :image="profile.avatar" :class="{ circle: profile.circle }" />

    <h3 v-if="profile.name" v-html="profile.name" />

    <p v-if="profile.description" v-html="profile.description" />
  </HomeBox>
</template>

<style scoped>
.home-profile :deep(.container) {
  overflow: hidden;
}

.home-profile :deep(img) {
  float: left;
  width: 64px;
  margin-right: 24px;
}

.home-profile :deep(img.circle) {
  border-radius: 50%;
}

@media (min-width: 960px) {
  .home-profile :deep(img) {
    width: 96px;
  }
}

.home-profile :deep(h3) {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
}

.home-profile :deep(p) {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  transition: color var(--t-color);
}
</style>
