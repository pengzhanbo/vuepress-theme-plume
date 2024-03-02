<script setup lang="ts">
import { computed } from 'vue'
import type { PlumeThemeHomeProfile } from '../../../shared/index.js'
import VImage from '../VImage.vue'
import { useThemeLocaleData } from '../../composables/index.js'

const props = defineProps<PlumeThemeHomeProfile & { onlyOnce?: boolean }>()

const theme = useThemeLocaleData()

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
  <div class="home-profile">
    <div class="container">
      <VImage v-if="profile.avatar" :image="profile.avatar" :class="{ circle: profile.circle }" />
      <h3 v-if="profile.name">
        {{ profile.name }}
      </h3>
      <p v-if="profile.description">
        {{ profile.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.home-profile {
  position: relative;
  padding: 24px;
}

@media (min-width: 640px) {
  .home-profile {
    padding: 32px 48px;
  }
}

@media (min-width: 960px) {
  .home-profile {
    padding: 48px 64px;
  }
}

.container {
  max-width: 1152px;
  margin: 0 auto;
  overflow: hidden;
}

.container :deep(img) {
  float: left;
  width: 64px;
  margin-right: 24px;
}

.container :deep(img.circle) {
  border-radius: 50%;
}

@media (min-width: 960px) {
  .container :deep(img) {
    width: 96px;
  }
}

.container :deep(h3) {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
}

.container :deep(p) {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  transition: color var(--t-color);
}
</style>
