<script setup lang="ts">
import { computed } from 'vue'
import { useThemeLocaleData } from '../../composables/index.js'
import SocialLinks from '../SocialLinks.vue'
import IconLocation from '../icons/IconLocation.vue'
import IconOrganization from '../icons/IconOrganization.vue'

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
      <p v-if="avatar.description" v-html="avatar.description" />
      <div v-if="avatar.location" class="avatar-location">
        <IconLocation />
        <p v-html="avatar.location" />
      </div>
      <div v-if="avatar.organization" class="avatar-organization">
        <IconOrganization />
        <p v-html="avatar.organization" />
      </div>
    </div>
    <div v-if="theme.social" class="avatar-social">
      <SocialLinks :links="theme.social" />
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
  font-size: 18px;
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

.avatar-location,
.avatar-organization {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--t-color);
}

.avatar-location p,
.avatar-organization p {
  margin: 0 4px;
}

.avatar-location + .avatar-organization {
  margin-top: 0;
}

.avatar-social {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border var(--t-color);
}

.avatar-social :deep(.social-link) {
  width: 32px;
  height: 32px;
}

.avatar-social :deep(.social-link:hover) {
  color: var(--vp-c-brand-1);
}
</style>
