<script lang="ts" setup>
import { useScrollLock } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useSidebar } from '../composables/sidebar.js'
import { inBrowser } from '../utils/index.js'
import SidebarItem from './SidebarItem.vue'

const props = defineProps<{
  open: boolean
}>()

const { sidebarGroups, hasSidebar } = useSidebar()

// a11y: focus Nav element when menu has opened
const navEl = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  [() => props.open, navEl],
  () => {
    if (props.open) {
      isLocked.value = true
      navEl.value?.focus()
    }
    else { isLocked.value = false }
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <Transition name="fade-slide-x" mode="out-in">
    <aside
      v-if="hasSidebar"
      ref="navEl"
      class="sidebar-wrapper"
      :class="{ open }"
      @click.stop
    >
      <div class="curtain" />

      <nav
        id="SidebarNav"
        class="nav"
        aria-labelledby="sidebar-aria-label"
        tabindex="-1"
      >
        <span id="sidebar-aria-label" class="visually-hidden">
          Sidebar Navigation
        </span>

        <div v-for="item in sidebarGroups" :key="item.text" class="group">
          <SidebarItem :item="item" :depth="0" />
        </div>
      </nav>
    </aside>
  </Transition>
</template>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  top: var(--vp-layout-top-height, 0);
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-sidebar);
  width: calc(100vw - 64px);
  max-width: 320px;
  padding: 32px 32px 96px;
  overflow: hidden auto;
  background-color: var(--vp-sidebar-bg-color);
  box-shadow: var(--vp-c-shadow-3);
  opacity: 0;
  transition:
    opacity var(--t-color),
    background-color var(--t-color),
    box-shadow var(--t-color),
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-100%);

  scrollbar-width: thin;
}

.sidebar-wrapper.open {
  visibility: visible;
  opacity: 1;
  transition:
    opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(0);
}

.dark .sidebar-wrapper {
  box-shadow: var(--vp-shadow-1);
}

@media (min-width: 960px) {
  .sidebar-wrapper {
    z-index: 1;
    width: var(--vp-sidebar-width);
    max-width: 100%;
    padding-top: var(--vp-nav-height);
    visibility: visible;
    background-color: var(--vp-sidebar-bg-color);
    box-shadow: none;
    opacity: 1;
    transform: translateX(0);
  }
}

@media (min-width: 1440px) {
  .sidebar-wrapper {
    width:
      calc(
        (100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) -
        32px
      );
    padding-left:
      max(
        32px,
        calc((100% - (var(--vp-layout-max-width) - 64px)) / 2)
      );
  }
}

@media (min-width: 960px) {
  .curtain {
    position: sticky;
    top: -64px;
    left: 0;
    z-index: 1;
    height: var(--vp-nav-height);
    margin-top: calc(var(--vp-nav-height) * -1);
    margin-right: -32px;
    margin-left: -32px;
    background-color: var(--vp-sidebar-bg-color);
    transition: background-color var(--t-color);
  }
}

.nav {
  outline: 0;
}

.group + .group {
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--t-color);
}

@media (min-width: 960px) {
  .group {
    width: calc(var(--vp-sidebar-width) - 64px);
    padding-top: 10px;
  }
}
</style>
