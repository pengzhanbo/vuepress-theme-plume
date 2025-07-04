<script lang="ts" setup>
import VPComment from '@theme/VPComment.vue'
import VPFriendsGroup from '@theme/VPFriendsGroup.vue'
import VPFriendsItem from '@theme/VPFriendsItem.vue'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { useData, useEditLink } from '../composables/index.js'

const editLink = useEditLink()
const { frontmatter: matter, page } = useData<'friends'>()

const list = computed(() => matter.value.list || [])
const groups = computed(() => matter.value.groups || [])
</script>

<template>
  <div class="vp-friends">
    <Content v-if="matter.contentPosition === 'before'" class="vp-doc plume-content before" vp-content />

    <h2 class="title">
      {{ matter.title || 'My Friends' }}
    </h2>
    <p v-if="matter.description && !page.autoDesc" class="description">
      {{ matter.description }}
    </p>
    <section v-if="list.length" class="friends-list">
      <VPFriendsItem
        v-for="(friend, index) in list"
        :key="friend.name + index"
        :friend="friend"
      />
    </section>

    <VPFriendsGroup v-for="(group, index) in groups" :key="index" :group="group" />

    <Content v-if="matter.contentPosition !== 'before'" class="vp-doc plume-content after" vp-content />

    <div v-if="editLink" class="edit-link">
      <VPLink
        class="edit-link-button"
        :href="editLink.link"
        :no-icon="true"
      >
        <span class="vpi-square-pen edit-link-icon" aria-label="edit icon" />
        {{ editLink.text }}
      </VPLink>
    </div>

    <VPComment />
  </div>
</template>

<style scoped>
.vp-friends {
  width: 100%;
  padding-top: calc(var(--vp-nav-height) + 32px);
  padding-bottom: 5rem;
  margin: 0 auto;
}

.vp-friends .title {
  padding: 32px 20px 0;
  margin-bottom: 2rem;
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-align: center;
  outline: none;
  transition: color var(--vp-t-color);
}

.vp-friends .description {
  padding: 0 20px;
  margin-bottom: 16px;
  line-height: 28px;
  color: var(--vp-c-text-1);
  text-align: center;
  transition: color var(--vp-t-color);
}

.friends-list {
  display: grid;
  gap: 20px;
  padding: 0 20px;
  margin-top: 48px;
}

.edit-link {
  display: flex;
  padding-left: 1rem;
  margin-top: 64px;
}

@media (min-width: 640px) {
  .vp-friends .title,
  .vp-friends .description {
    padding-left: 16px;
  }

  .friends-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0 16px;
  }
}

@media (min-width: 960px) {
  .vp-friends {
    max-width: 864px;
    padding-top: 48px;
  }

  .vp-friends .title,
  .vp-friends .description,
  .edit-link {
    padding-left: 0;
  }

  .friends-list {
    padding: 0;
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
  transition: color var(--vp-t-color);
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

.vp-friends .vp-doc.after {
  margin-top: 48px;
}
</style>
