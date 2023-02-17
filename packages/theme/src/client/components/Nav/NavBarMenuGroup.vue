<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import type { NavItemWithChildren } from '../../../shared/index.js'
import { isActive } from '../../utils/index.js'
import Flyout from '../Flyout/index.vue'

defineProps<{
  item: NavItemWithChildren
}>()

const page = usePageData()
</script>

<template>
  <Flyout
    :class="{
      'navbar-menu-group': true,
      'active': isActive(page.path, item.activeMatch, !!item.activeMatch),
    }"
    :button="item.text"
    :items="item.items"
    :prefix-icon="item.icon"
  />
</template>
