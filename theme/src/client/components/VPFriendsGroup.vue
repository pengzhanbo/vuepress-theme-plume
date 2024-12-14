<script lang="ts" setup>
import type { FriendGroup } from '../../shared/index.js'
import VPFriendsItem from '@theme/VPFriendsItem.vue'

defineProps<{
  group: FriendGroup
}>()
</script>

<template>
  <div class="vp-friends-group">
    <h3 class="title">
      {{ group.title || 'My Friends' }}
    </h3>
    <p v-if="group.desc" class="description">
      {{ group.desc }}
    </p>
    <section v-if="group.list?.length" class="friends-list">
      <VPFriendsItem
        v-for="(friend, index) in group.list"
        :key="friend.name + index"
        :friend="friend"
      />
    </section>
  </div>
</template>

<style scoped>
.vp-friends-group {
  width: 100%;
  padding: 64px 20px 0;
  margin: 0 auto;
}

.vp-friends-group .title {
  padding-top: 3rem;
  padding-bottom: 8px;
  margin-bottom: 28px;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-align: center;
  border-top: solid 1px var(--vp-c-divider);
  outline: none;
  transition: color var(--vp-t-color), border-color var(--vp-t-color);
}

.vp-friends-group .description {
  margin-bottom: 16px;
  line-height: 28px;
  color: var(--vp-c-text-1);
  text-align: center;
  transition: color var(--vp-t-color);
}

.friends-list {
  display: grid;
  gap: 20px;
  margin-top: 32px;
}

@media (min-width: 640px) {
  .friends-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .vp-friends-group {
    padding: 64px 0 0;
  }

  .friends-list {
    padding: 0;
  }
}
</style>
