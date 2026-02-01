<script lang="ts" setup>
import VPSidebarGroup from '@theme/VPSidebarGroup.vue'
import VPTransitionFadeSlideY from '@theme/VPTransitionFadeSlideY.vue'
import { useScrollLock } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoutePath } from 'vuepress/client'
import { useData, useLayout, useSidebar, useSidebarControl } from '../composables/index.js'
import { inBrowser } from '../utils/index.js'

const { open } = defineProps<{
  open: boolean
}>()

const { theme } = useData()
const { hasSidebar } = useLayout()
const { sidebarGroups, sidebarKey } = useSidebar()
const { isSidebarCollapsed, toggleSidebarCollapse } = useSidebarControl()
const routePath = useRoutePath()

// a11y: focus Nav element when menu has opened
const navEl = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  [() => open, navEl],
  () => {
    if (open) {
      isLocked.value = true
      navEl.value?.focus()
    }
    else { isLocked.value = false }
  },
  { immediate: true, flush: 'post' },
)

/**
 * Scroll to active item
 */
onMounted(() => {
  watch(sidebarKey, async () => {
    await nextTick()
    const activeItem = document.querySelector(
      `.vp-sidebar .vp-link[href*="${routePath.value}"]`,
    )
    if (!navEl.value)
      return

    if (!activeItem) {
      // 等待动画进入透明状态后再重置滚动位置，避免内容闪烁
      setTimeout(() => navEl.value?.scrollTo(0, 0), 200)
      return
    }

    const { top: navTop, height: navHeight } = navEl.value.getBoundingClientRect()
    const { top: activeTop, height: activeHeight }
      = activeItem.getBoundingClientRect()

    if (activeTop < navTop || activeTop + activeHeight > navTop + navHeight)
      activeItem.scrollIntoView({ block: 'center' })
  }, { immediate: true, flush: 'post' })
})
</script>

<template>
  <Transition name="fade-slide-x" mode="out-in">
    <aside
      v-if="hasSidebar"
      ref="navEl"
      class="vp-sidebar"
      :class="{
        open,
        'hide-scrollbar': !(theme.sidebarScrollbar ?? true),
        'collapsed': isSidebarCollapsed,
      }"
      vp-sidebar
      @click.stop
    >
      <div class="curtain" />

      <VPTransitionFadeSlideY>
        <nav
          id="SidebarNav"
          :key="sidebarKey"
          class="nav"
          aria-labelledby="sidebar-aria-label"
          tabindex="-1"
        >
          <span id="sidebar-aria-label" class="visually-hidden">
            Sidebar Navigation
          </span>

          <slot name="sidebar-nav-before" />

          <VPSidebarGroup :items="sidebarGroups" />

          <slot name="sidebar-nav-after" />
        </nav>
      </VPTransitionFadeSlideY>
    </aside>
  </Transition>
  <div v-if="hasSidebar" class="vp-sidebar-control" :class="{ collapsed: isSidebarCollapsed }">
    <button
      type="button" class="toggle-sidebar-btn"
      aria-label="Toggle sidebar"
      @click="toggleSidebarCollapse()"
    >
      <span :class="`vpi-sidebar-${isSidebarCollapsed ? 'open' : 'close'}`" />
    </button>
  </div>
</template>

<style scoped>
.vp-sidebar {
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
    opacity var(--vp-t-color),
    background-color var(--vp-t-color),
    box-shadow var(--vp-t-color),
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-100%);

  scrollbar-width: thin;
}

.vp-sidebar.open {
  visibility: visible;
  opacity: 1;
  transition:
    opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(0);
}

.vp-sidebar.hide-scrollbar {
  scrollbar-width: none;
}

.vp-sidebar.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

[data-theme="dark"] .vp-sidebar {
  box-shadow: var(--vp-shadow-1);
}

@media (min-width: 960px) {
  .vp-sidebar {
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

  .vp-sidebar:not(.open).collapsed {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@media (min-width: 1440px) {
  .vp-sidebar {
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
    top: calc(var(--vp-nav-height) * -1);
    left: 0;
    z-index: 1;
    height: var(--vp-nav-height);
    margin-top: calc(var(--vp-nav-height) * -1);
    margin-right: -32px;
    margin-left: -32px;
    background-color: var(--vp-sidebar-bg-color);
    transition: background-color var(--vp-t-color);
  }
}

.nav {
  outline: 0;
}

.vp-sidebar-control {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: calc(var(--vp-z-index-sidebar) + 1);
  display: none;
  width: calc(100vw - 64px);
  max-width: 320px;
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(0);
}

.vp-sidebar-control .toggle-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  box-shadow: 0 0 0 transparent;
  transition: background-color var(--vp-t-color), box-shadow var(--vp-t-color), border-color var(--vp-t-color);
}

.vp-sidebar-control [class^="vpi-sidebar-"] {
  font-size: 20px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

@media (min-width: 960px) {
  .vp-sidebar-control {
    display: flex;
    justify-content: flex-end;
    width: var(--vp-sidebar-width);
    max-width: 100%;
    padding-right: 7px;
  }
}

@media (min-width: 1440px) {
  .vp-sidebar-control {
    width:
      calc(
        (100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) -
        32px
      );
  }
}

.vp-sidebar-control.collapsed {
  transform: translateX(calc(-100% + 54px));
}

.vp-sidebar-control.collapsed .toggle-sidebar-btn {
  width: 36px;
  height: 36px;
  background-color: var(--vp-c-bg-safe);
  border-color: var(--vp-c-divider);
  box-shadow: var(--vp-shadow-2);
}
</style>
