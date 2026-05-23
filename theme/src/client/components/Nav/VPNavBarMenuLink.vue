<script lang="ts" setup>
import type { ResolvedNavItemWithLink } from '../../../shared/index.js'
import VPBadge from '@theme/global/VPBadge.vue'
import VPIcon from '@theme/VPIcon.vue'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { resolveRouteFullPath } from 'vuepress/client'
import { useData } from '../../composables/index.js'
import { isActive } from '../../utils/index.js'

const { item } = defineProps<{
  item: ResolvedNavItemWithLink
}>()

const { page } = useData()

const isActiveLink = computed(() => isActive(
  page.value.path,
  item.activeMatch || resolveRouteFullPath(item.link),
  !!item.activeMatch,
))
</script>

<template>
  <VPLink
    class="navbar-menu-link" :class="{ active: isActiveLink }"
    :href="item.link"
    :no-icon="item.noIcon"
    :target="item.target"
    :rel="item.rel"
    tabindex="0"
  >
    <VPIcon v-if="item.icon" :name="item.icon" />
    <span v-html="item.text" />
    <VPBadge
      v-if="item.badge"
      class="vp-menu-badge"
      v-bind="typeof item.badge === 'string' ? { text: item.badge } : item.badge"
    />
  </VPLink>
</template>

<style scoped>
.navbar-menu-link {
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.navbar-menu-link.active {
  color: var(--vp-c-brand-1);
}

.navbar-menu-link:hover {
  color: var(--vp-c-brand-1);
}

.navbar-menu-link :deep(.vp-menu-badge) {
  transform: translateY(0);
}
</style>
