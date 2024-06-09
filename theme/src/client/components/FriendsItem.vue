<script lang="ts" setup>
import { isPlainObject } from '@vuepress/helper/client'
import { computed } from 'vue'
import type { FriendsItem } from '../../shared/index'
import { useDarkMode } from '../composables/dark-mode.js'
import AutoLink from './AutoLink.vue'

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
    ...getStyle('--vp-friends-border-color', props.friend.borderColor),
    ...getStyle('--vp-friends-name-color', props.friend.nameColor),
  }
})
</script>

<template>
  <div class="friend" :style="friendStyle">
    <AutoLink
      class="avatar-link"
      :href="friend.link"
      no-icon
    >
      <div
        class="avatar"
        :style="{ backgroundImage: `url(${friend.avatar})` }"
      />
    </AutoLink>

    <div class="content">
      <AutoLink
        class="title"
        :href="friend.link"
        no-icon
      >
        {{ friend.name }}
      </AutoLink>
      <p v-if="friend.desc">
        {{ friend.desc }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.friend {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 8px;
  background-color: var(--vp-friends-bg-color);
  border: 1px solid var(--vp-friends-border-color);
  border-radius: 6px;
  box-shadow: var(--vp-shadow-1);
  transition: all var(--t-color);
}

.friend:hover {
  box-shadow: var(--vp-shadow-2);
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

.content .title {
  display: block;
  padding-bottom: 8px;
  padding-left: 16px;
  margin-bottom: 8px;
  margin-left: -16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-friends-name-color);
  border-bottom: 1px dashed var(--vp-friends-border-color);
  transition: color var(--t-color), border-bottom var(--t-color);
}

.content p {
  display: -webkit-box;
  padding-top: 8px;
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-friends-text-color);
  transition: color var(--t-color);

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
../composables/dark-mode.js
