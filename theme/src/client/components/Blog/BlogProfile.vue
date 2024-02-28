<script setup lang="ts">
import { computed } from 'vue'
import { useThemeLocaleData } from '../../composables/index.js'

const theme = useThemeLocaleData()
const avatar = computed(() => theme.value.avatar)
</script>

<template>
  <div v-if="avatar" class="avatar-profile">
    <p v-if="avatar.url" :class="{ circle: avatar.circle }">
      <img :src="avatar.url" :alt="avatar.name">
    </p>
    <div>
      <h3>{{ avatar.name }}</h3>
      <p>{{ avatar.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.avatar-profile {
  padding: 24px 20px;
  margin-bottom: 24px;
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  transition: var(--t-color);
  transition-property: background-color, color, box-shadow, transform;
  transform: scale(1);
}

.avatar-profile:hover {
  box-shadow: var(--vp-shadow-2);
  transform: scale(1.002);
}

.avatar-profile img {
  width: 60%;
  margin: auto;

  object-fit: cover;
}

.avatar-profile h3 {
  margin-top: 1.5rem;
  font-size: 16px;
  font-weight: 600;
}

.avatar-profile h3,
.avatar-profile p {
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.avatar-profile .circle img {
  overflow: hidden;
  border-radius: 50%;
}
</style>
