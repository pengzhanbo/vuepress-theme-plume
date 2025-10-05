<script lang="ts" setup>
import VPSidebarGroup from '@theme/VPSidebarGroup.vue'
import VPTransitionFadeSlideY from '@theme/VPTransitionFadeSlideY.vue'
import { useScrollLock } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoutePath } from 'vuepress/client'
import { useData, useSidebar } from '../composables/index.js'
import { inBrowser } from '../utils/index.js'

const props = defineProps<{
  open: boolean
}>()

const { theme } = useData()
const { sidebarGroups, hasSidebar, sidebarKey } = useSidebar()
const routePath = useRoutePath()

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
      :class="{ open, 'hide-scrollbar': !(theme.sidebarScrollbar ?? true) }"
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
    top: -64px;
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
</style>
