<script lang="ts" setup>
import { computed } from 'vue'
import { useData, useEditNavLink } from '../composables/index.js'
import AutoLink from './AutoLink.vue'
import FriendsItem from './FriendsItem.vue'
import FriendsGroup from './FriendsGroup.vue'

const editNavLink = useEditNavLink()
const { frontmatter: matter } = useData<'friends'>()

const list = computed(() => matter.value.list || [])
const groups = computed(() => matter.value.groups || [])
</script>

<template>
  <div class="friends-wrapper">
    <h2 class="title">
      {{ matter.title || 'My Friends' }}
    </h2>
    <p v-if="matter.description" class="description">
      {{ matter.description }}
    </p>
    <section v-if="list.length" class="friends-list">
      <FriendsItem
        v-for="(friend, index) in list"
        :key="friend.name + index"
        :friend="friend"
      />
    </section>

    <FriendsGroup v-for="(group, index) in groups" :key="index" :group="group" />

    <div v-if="editNavLink" class="edit-link">
      <AutoLink
        class="edit-link-button"
        :href="editNavLink.link"
        :no-icon="true"
      >
        <span class="vpi-square-pen edit-link-icon" aria-label="edit icon" />
        {{ editNavLink.text }}
      </AutoLink>
    </div>
  </div>
</template>

<style scoped>
.friends-wrapper {
  width: 100%;
  min-height: calc(100vh - var(--vp-footer-height, 0px));
  padding-top: var(--vp-nav-height);
  padding-bottom: 5rem;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .friends-wrapper {
    min-height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
  }
}

.friends-wrapper .title {
  padding-top: 3rem;
  padding-left: 1rem;
  margin-bottom: 1rem;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  outline: none;
}

.friends-wrapper .description {
  padding-left: 1rem;
  margin-bottom: 16px;
  line-height: 28px;
  color: var(--vp-c-text-1);
}

.friends-list {
  display: grid;
  gap: 16px;
  padding: 0 16px;
  margin-top: 64px;
}

.edit-link {
  padding-left: 1rem;
  margin-top: 64px;
}

@media (min-width: 640px) {
  .friends-wrapper .title,
  .friends-wrapper .description {
    padding-left: 16px;
  }

  .friends-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0 16px;
  }
}

@media (min-width: 960px) {
  .friends-wrapper {
    max-width: 784px;
    padding-top: 0;
  }

  .friends-wrapper .title,
  .friends-wrapper .description,
  .edit-link {
    padding-left: 0;
  }

  .friends-list {
    padding: 0;
  }
}

@media (min-width: 1440px) {
  .friends-wrapper {
    max-width: 1104px;
  }

  .friends-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.edit-link-button {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: var(--vp-c-brand-1);
  border: 0;
  transition: color var(--t-color);
}

.edit-link-button:hover {
  color: var(--vp-c-brand-2);
}

.edit-link-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  fill: currentcolor;
}
</style>
