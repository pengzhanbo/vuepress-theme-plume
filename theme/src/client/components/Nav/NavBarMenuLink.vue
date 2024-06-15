<script lang="ts" setup>
import type { NavItemWithLink } from '../../../shared/index.js'
import { isActive } from '../../utils/index.js'
import VPLink from '../VPLink.vue'
import VPIcon from '../VPIcon.vue'
import { useData } from '../../composables/data.js'

defineProps<{
  item: NavItemWithLink
}>()

const { page } = useData()
</script>

<template>
  <VPLink
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
    <VPIcon v-if="item.icon" :name="item.icon" />
    <i v-text="item.text" />
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
  transition: color var(--t-color);
}

.navbar-menu-link.active {
  color: var(--vp-c-brand-1);
}

.navbar-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
