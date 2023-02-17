<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import type { NavItemWithLink } from '../../../shared/index.js'
import { isActive } from '../../utils/index.js'
import AutoLink from '../AutoLink.vue'

defineProps<{
  item: NavItemWithLink
}>()

const page = usePageData()
</script>

<template>
  <AutoLink
    :class="{
      'navbar-menu-link': true,
      'active': isActive(
        page.path,
        item.activeMatch || item.link,
        !!item.activeMatch
      ),
    }"
    :href="item.link"
    :no-icon="true"
  >
    <Icon v-if="item.icon" :name="item.icon" />
    {{ item.text }}
  </AutoLink>
</template>

<style scoped>
.navbar-menu-link {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.navbar-menu-link.active {
  color: var(--vp-c-brand);
}

.navbar-menu-link:hover {
  color: var(--vp-c-brand);
}
</style>
