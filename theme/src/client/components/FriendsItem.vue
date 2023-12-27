<script lang="ts" setup>
import type { FriendsItem } from '../../shared/index'
import AutoLink from './AutoLink.vue'

defineProps<{
  friend: FriendsItem
}>()
</script>

<template>
  <div class="friend">
    <AutoLink class="avatar-link" :href="friend.link" no-icon>
      <div class="avatar" :style="{ backgroundImage: `url(${friend.avatar})` }" />
    </AutoLink>
    <div class="content">
      <AutoLink class="title" :href="friend.link" no-icon>
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
  border-radius: 6px;
  border: 1px solid var(--vp-friends-border-color);
  margin-bottom: 8px;
  transition: all 0.25s;
  background-color: var(--vp-friends-bg-color);
  box-shadow: var(--vp-shadow-1);
}

.friend:hover {
  box-shadow: var(--vp-shadow-3);
}

.avatar-link {
  display: inline-block;
  margin-right: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 100%;
  background-size: cover;
  background-color: var(--vp-c-default-soft);
}
.content {
  flex: 1;
}

.content .title {
  display: block;
  font-weight: 700;
  font-size: 18px;
  color: var(--vp-friends-link-color);
  padding-left: 16px;
  padding-bottom: 8px;
  margin-left: -16px;
  margin-bottom: 8px;
  border-bottom: 1px dashed var(--vp-friends-border-color);
}

.content p {
  font-size: 0.875rem;
  line-height: 1.5;
  padding-top: 8px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  color: var(--vp-friends-text-color);
}
</style>
