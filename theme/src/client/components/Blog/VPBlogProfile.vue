<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { isLinkHttp } from 'vuepress/shared'
import VPSocialLinks from '@theme/VPSocialLinks.vue'
import { useData } from '../../composables/data.js'

const { theme } = useData()
const avatar = computed(() => theme.value.avatar)
const imageUrl = computed(() => {
  const url = avatar.value?.url
  if (!url)
    return ''
  if (isLinkHttp(url))
    return url
  return withBase(url)
})
</script>

<template>
  <div v-if="avatar" class="vp-blog-profile">
    <p v-if="imageUrl" :class="{ circle: !!avatar.circle }">
      <img :src="imageUrl" :alt="avatar.name">
    </p>
    <div class="profile-info">
      <h3>{{ avatar.name }}</h3>
      <p v-if="avatar.description" v-html="avatar.description" />
      <div v-if="avatar.location" class="profile-location">
        <span class="vpi-location" />
        <p v-if="avatar.location" v-html="avatar.location" />
      </div>
      <div v-if="avatar.organization" class="profile-organization">
        <span class="vpi-organization" />
        <p v-if="avatar.organization" v-html="avatar.organization" />
      </div>
    </div>
    <div v-if="theme.social" class="profile-social">
      <VPSocialLinks :links="theme.social" />
    </div>
  </div>
</template>

<style scoped>
.vp-blog-profile {
  padding: 24px 20px;
  margin-bottom: 24px;
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  transition: var(--t-color);
  transition-property: background-color, color, box-shadow;
}

.vp-blog-profile:hover {
  box-shadow: var(--vp-shadow-2);
}

.vp-blog-profile img {
  width: 60%;
  margin: auto;

  object-fit: cover;
}

.vp-blog-profile h3 {
  margin-top: 1.5rem;
  font-size: 18px;
  font-weight: 600;
}

.vp-blog-profile h3,
.vp-blog-profile p {
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.vp-blog-profile .circle img {
  overflow: hidden;
  border-radius: 50%;
}

.profile-location,
.profile-organization {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--t-color);
}

.profile-location p,
.profile-organization p {
  margin: 0 4px;
}

.profile-location + .profile-organization {
  margin-top: 0;
}

.profile-social {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border var(--t-color);
}

.profile-social :deep(.vp-social-link) {
  width: 32px;
  height: 32px;
}

.profile-social :deep(.vp-social-link:hover) {
  color: var(--vp-c-brand-1);
}
</style>
