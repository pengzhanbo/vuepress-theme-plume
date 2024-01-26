<script lang="ts" setup>
import { usePageData } from 'vuepress/client'
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
    class="navbar-menu-link" :class="{
      active: isActive(
        page.path,
        item.activeMatch || item.link,
        !!item.activeMatch,
      ),
    }"
    :href="item.link"
    :no-icon="true"
  >
    <Icon v-if="item.icon" :name="item.icon" />
    <i v-text="item.text" />
  </AutoLink>
</template>

<style scoped>
.navbar-menu-link {
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.navbar-menu-link.active {
  color: var(--vp-c-brand-1);
}

.navbar-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
