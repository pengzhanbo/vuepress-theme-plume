<script lang="ts" setup>
import { usePageData } from 'vuepress/client'
import { computed } from 'vue'
import type { NavItem, NavItemWithChildren } from '../../../shared/index.js'
import { isActive } from '../../utils/index.js'
import Flyout from '../Flyout/index.vue'

const props = defineProps<{
  item: NavItemWithChildren
}>()

const page = usePageData()

function isChildActive(navItem: NavItem) {
  if ('link' in navItem) {
    return isActive(
      page.value.path,
      navItem.link,
      !!props.item.activeMatch,
    )
  }
  else {
    return navItem.items.some(isChildActive)
  }
}
const childrenActive = computed(() => isChildActive(props.item))
</script>

<template>
  <Flyout
    class="navbar-menu-group" :class="{
      active: isActive(page.path, item.activeMatch, !!item.activeMatch) || childrenActive,
    }"
    :button="item.text"
    :items="item.items"
    :prefix-icon="item.icon"
  />
</template>
