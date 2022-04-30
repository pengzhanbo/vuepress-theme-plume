<script lang="ts" setup>
import SidebarItems from '@theme-plume/SidebarItems.vue'
import type { PropType } from 'vue'
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarOptions } from '../../shared'
import { useAsideNavbar, useSidebarIndex } from '../composables'

defineProps({
  aside: {
    type: Array as PropType<SidebarOptions>,
    required: false,
    default: () => [],
  },
})
const route = useRoute()
const { sidebarList, initSidebarList } = useSidebarIndex()
const { triggerAsideNavbar } = useAsideNavbar()
initSidebarList(route.path)
watchEffect(() => {
  initSidebarList(route.path)
  triggerAsideNavbar(false)
})
</script>
<template>
  <aside class="plume-theme-sidebar-wrapper">
    <SidebarItems class="aside-navbar" :sidebar-list="aside" />
    <SidebarItems :sidebar-list="sidebarList" />
  </aside>
</template>
<style lang="scss">
@import '../styles/variables';

.plume-theme-sidebar-wrapper {
  position: sticky;
  top: calc(var(--navbar-height) + 1.25rem);
  width: 20rem;
  height: calc(100vh - var(--navbar-height) - 1.25rem);
  border-right: solid 1px var(--c-border);
  font-size: 18px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--c-brand) var(--c-border);
  background-color: var(--c-bg-container);
  transition: transform var(--t-color), background-color var(--t-color);

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--c-border);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--c-brand);
  }

  > .aside-navbar {
    position: relative;
    padding-bottom: 0.75rem;
    margin-bottom: 1.25rem;

    &::after {
      content: '';
      position: absolute;
      left: -1.25rem;
      bottom: -4px;
      right: 0;
      border-bottom: solid 4px var(--c-border);
    }
  }
}

@media (max-width: $MQMobile) {
  .plume-theme-sidebar-wrapper {
    display: none;
  }
}
</style>
