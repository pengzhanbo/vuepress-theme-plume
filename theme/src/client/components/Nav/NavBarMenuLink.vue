<script lang="ts" setup>
import type { NavItemWithLink } from '../../../shared/index.js'
import { isActive } from '../../utils/index.js'
import AutoLink from '../AutoLink.vue'
import VIcon from '../VIcon.vue'
import { useData } from '../../composables/data.js'

defineProps<{
  item: NavItemWithLink
}>()

const { page } = useData()
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
    <VIcon v-if="item.icon" :name="item.icon" />
    <i v-text="item.text" />
  </AutoLink>
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
  transition: color var(--t-color);
}

.navbar-menu-link.active {
  color: var(--vp-c-brand-1);
}

.navbar-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
