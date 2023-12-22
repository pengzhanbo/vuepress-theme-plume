<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import { useWindowScroll } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import type {
  PlumeThemePageData,
} from '../../shared/index.js'
import { useSidebar, useThemeLocaleData } from '../composables/index.js'
import IconAlignLeft from './icons/IconAlignLeft.vue'
import LocalNavOutlineDropdown from './LocalNavOutlineDropdown.vue'

defineProps<{
  open: boolean
}>()

defineEmits<(e: 'open-menu') => void>()

const page = usePageData<PlumeThemePageData>()
const themeData = useThemeLocaleData()

const { hasSidebar } = useSidebar()
const { y } = useWindowScroll()

const navHeight = ref(0)

const headers = computed(() => page.value.headers)
const empty = computed(() => {
  return headers.value.length === 0 && !hasSidebar.value
})

onMounted(() => {
  navHeight.value = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--vp-nav-height'
    )
  )
})

const classes = computed(() => {
  return {
    'local-nav': true,
    fixed: empty.value,
    'reached-top': y.value >= navHeight.value
  }
})

</script>

<template>
  <div v-if="hasSidebar && (!empty || y >= navHeight)" :class="classes">
    <button
      class="menu"
      :aria-expanded="open"
      aria-controls="SidebarNav"
      @click="$emit('open-menu')"
    >
      <IconAlignLeft class="menu-icon" />
      <span class="menu-text"> {{ themeData.sidebarMenuLabel || 'Menu' }} </span>
    </button>

    <LocalNavOutlineDropdown :headers="headers" :nav-height="navHeight" />
  </div>
</template>

<style scoped>
.local-nav {
  position: sticky;
  top: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-top: var(--vp-layout-top-height, 0px);
  width: 100%;
  background-color: var(--vp-local-nav-bg-color);
  transition: border-color 0.5s, background-color 0.5s;
}

.local-nav.fixed {
  position: fixed;
}

.local-nav.reached-top {
  border-top-color: transparent;
}

@media (min-width: 960px) {
  .local-nav {
    display: none;
  }
}

.menu {
  display: flex;
  align-items: center;
  padding: 12px 24px 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 768px) {
  .menu {
    padding: 0 32px;
  }
}

.menu-icon {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.top-link {
  display: block;
  padding: 12px 24px 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.top-link:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 768px) {
  .top-link {
    padding: 12px 32px 11px;
  }
}
</style>
