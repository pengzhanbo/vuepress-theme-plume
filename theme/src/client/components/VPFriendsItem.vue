<script lang="ts" setup>
import { isPlainObject } from '@vuepress/helper/client'
import { computed } from 'vue'
import VPLink from '@theme/VPLink.vue'
import type { FriendsItem } from '../../shared/index'
import { useDarkMode } from '../composables/dark-mode.js'
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
      'only-title': !friend.desc && (!friend.socials || !friend.socials.length),
    }"
  >
    <VPLink
      class="avatar-link"
      :href="friend.link"
      no-icon
    >
      <div
        class="avatar"
        :style="{ backgroundImage: `url(${friend.avatar})` }"
      />
    </VPLink>

    <div class="content">
      <VPLink
        class="title"
        :href="friend.link"
        no-icon
      >
        {{ friend.name }}
      </VPLink>
      <VPSocialLinks v-if="friend.socials" :links="friend.socials" />
      <p v-if="friend.desc">
        {{ friend.desc }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.vp-friend {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  margin-bottom: 8px;
  background-color: var(--vp-friends-bg-color);
  border-radius: 6px;
  transition: all var(--t-color);
}

.avatar-link {
  display: inline-block;
  margin-right: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  background-color: var(--vp-c-default-soft);
  background-size: cover;
  border-radius: 100%;
}

.content {
  flex: 1;
}

.vp-friend.only-title .content {
  margin-top: 20px;
}

.content .title {
  padding-bottom: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-friends-name-color);
  transition: color var(--t-color), border-bottom var(--t-color);
}

.content :deep(.vp-social-links) {
  justify-content: flex-start;
  margin-top: 8px;
}

.content :deep(.vp-social-link) {
  color: var(--vp-friends-name-color);
}

.content p {
  display: -webkit-box;
  padding-top: 16px;
  overflow: hidden;
  line-height: 1.5;
  color: var(--vp-friends-text-color);
  transition: color var(--t-color);

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
