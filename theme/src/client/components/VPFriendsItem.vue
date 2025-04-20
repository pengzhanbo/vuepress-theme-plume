<script lang="ts" setup>
import type { FriendsItem } from '../../shared/index'
import VPLink from '@theme/VPLink.vue'
import { isPlainObject } from '@vuepress/helper/client'
import { computed } from 'vue'
import { useDarkMode } from '../composables/index.js'
import VPSocialLinks from './VPSocialLinks.vue'

const props = defineProps<{
  friend: FriendsItem
}>()

const isDark = useDarkMode()

function getStyle(name: string, color?: string | { light: string, dark: string }) {
  if (!color)
    return {}
  const value = isPlainObject(color) ? isDark.value ? color.dark : color.light : color
  return value ? { [name]: value } : {}
}

const friendStyle = computed(() => {
  return {
    ...getStyle('--vp-friends-text-color', props.friend.color),
    ...getStyle('--vp-friends-bg-color', props.friend.backgroundColor),
    ...getStyle('--vp-friends-name-color', props.friend.nameColor),
  }
})
</script>

<template>
  <div
    class="vp-friend" :style="friendStyle" :class="{
      'only-title': !friend.desc && !friend.socials?.length && !friend.location && !friend.organization,
      'no-desc': !friend.desc,
    }"
  >
    <div class="avatar">
      <img :src="friend.avatar" :alt="friend.name">
    </div>

    <div class="content">
      <VPLink class="title" :href="friend.link" no-icon :text="friend.name" />
      <p v-if="friend.location" class="location">
        <span class="vpi-location" />
        <span>{{ friend.location }}</span>
      </p>
      <p v-if="friend.organization" class="organization">
        <span class="vpi-organization" />
        <span>{{ friend.organization }}</span>
      </p>
      <p v-if="friend.desc" class="desc" :class="{ offset: friend.location && friend.organization }">
        {{ friend.desc }}
      </p>
      <VPSocialLinks v-if="friend.socials" :links="friend.socials" />
    </div>
  </div>
</template>

<style scoped>
.vp-friend {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px;
  margin-bottom: 8px;
  background-color: var(--vp-friends-bg-color);
  border-radius: 6px;
  transition: all var(--vp-t-color);
}

.avatar {
  width: 88px;
  height: 88px;
  overflow: hidden;
  background-color: var(--vp-c-default-soft);
  border-radius: 100%;
}

.avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: top;
}

.content {
  flex: 1 2;
}

.vp-friend.only-title .content {
  margin-top: 30px;
}

.content .title {
  padding-bottom: 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-friends-name-color);
  transition: color var(--vp-t-color), border-bottom var(--vp-t-color);
}

.content .title::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: "";
}

.content .location,
.content .organization {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 16px;
  font-size: 14px;
  color: var(--vp-friends-text-color);
  opacity: 0.8;
  transition: color var(--vp-t-color);
}

.content .location + .organization {
  padding-top: 0;
}

.content .desc {
  padding-top: 16px;
  line-height: 1.5;
  color: var(--vp-friends-text-color);
  transition: color var(--vp-t-color);
}

.content .desc.offset {
  margin-top: 4px;
  margin-left: -104px;
}

.content :deep(.vp-social-links) {
  justify-content: flex-end;
  margin-top: 8px;
}

.content :deep(.vp-social-links .vp-social-link) {
  position: relative;
  z-index: 2;
}

.vp-friend.no-desc .content :deep(.vp-social-links) {
  justify-content: flex-start;
}

.content :deep(.vp-social-link) {
  color: var(--vp-friends-name-color);
}
</style>
