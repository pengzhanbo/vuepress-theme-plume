<script lang="ts" setup>
import SidebarItems from '@theme-plume/SidebarItems.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useSidebarIndex } from '../composables'

const route = useRoute()
const { sidebarList, initSidebarList } = useSidebarIndex()
initSidebarList(route.path)
onBeforeRouteUpdate((to) => {
  initSidebarList(to.path)
})
</script>
<template>
  <aside class="plume-theme-sidebar-wrapper">
    <SidebarItems :sidebar-list="sidebarList" />
  </aside>
</template>
<style lang="scss">
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
}
</style>
