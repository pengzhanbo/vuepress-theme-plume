<script lang="ts" setup>
import type {
  ResolvedNavItem,
  ResolvedNavItemWithChildren,
} from '../../../shared/index.js'
import VPFlyout from '@theme/VPFlyout.vue'
import { computed } from 'vue'
import { resolveRouteFullPath } from 'vuepress/client'
import { useData } from '../../composables/index.js'
import { isActive } from '../../utils/index.js'

const { item } = defineProps<{
  item: ResolvedNavItemWithChildren
}>()

const { page } = useData()

function isChildActive(navItem: ResolvedNavItem): boolean {
  if ('link' in navItem) {
    return isActive(
      page.value.path,
      resolveRouteFullPath(navItem.link),
      !!item.activeMatch,
    )
  }
  else {
    return navItem.items.some(isChildActive)
  }
}
const childrenActive = computed(() => isChildActive(item))
</script>

<template>
  <VPFlyout
    class="vp-navbar-menu-group" :class="{
      active: isActive(
        page.path, item.activeMatch,
        !!item.activeMatch,
      ) || childrenActive,
    }"
    :button="item.text"
    :items="item.items"
    :prefix-icon="item.icon"
    :badge="item.badge"
  />
</template>
