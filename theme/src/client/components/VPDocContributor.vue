<script setup lang="ts">
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { useContributors, useData } from '../composables/index.js'

const { theme, frontmatter } = useData()

const { contributors, mode } = useContributors()
const hasContributors = computed(() => Boolean(contributors.value.length) && mode.value === 'block')

const header = computed(() => {
  const outline = frontmatter.value.outline ?? theme.value.outline
  const level = Array.isArray(outline) ? outline[0] : outline === 'deep' ? 2 : outline || 2
  return `h${level}`
})
</script>

<template>
  <div v-if="hasContributors" class="vp-doc-contributor">
    <component :is="header" id="doc-contributors" tabindex="-1">
      <a href="#doc-contributors" class="header-anchor">
        <span>{{ theme.contributorsText || 'Contributors' }}</span>
      </a>
    </component>

    <ul class="contributor-list">
      <li v-for="contributor in contributors" :key="contributor.name + contributor.email" class="contributor">
        <VPLink :href="contributor.url" no-icon>
          <img v-if="contributor.avatar" :src="contributor.avatar" :alt="contributor.name">
          <span>{{ contributor.name }}</span>
        </VPLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.vp-doc .vp-doc-contributor h2 {
  border-top: 1px solid var(--vp-c-divider);
}

.vp-doc-contributor .contributor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 16px;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0;
  margin-top: 32px;
  list-style: none;
}

.contributor-list .contributor img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.contributor-list .contributor :deep(.vp-link) {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
</style>
