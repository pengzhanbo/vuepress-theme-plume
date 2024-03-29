<script lang="ts" setup>
import { usePageData } from 'vuepress/client'
import { useWindowScroll } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import type {
  PlumeThemePageData,
} from '../../../shared/index.js'
import { useSidebar, useThemeLocaleData } from '../../composables/index.js'
import LocalNavOutlineDropdown from './LocalNavOutlineDropdown.vue'

const props = defineProps<{
  open: boolean
  showOutline: boolean
}>()

defineEmits<(e: 'openMenu') => void>()

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
  navHeight.value = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--vp-nav-height',
    ),
  )
})

const classes = computed(() => {
  return {
    'local-nav': true,
    'fixed': empty.value,
    'reached-top': y.value >= navHeight.value,
    'is-blog': page.value.isBlogPost,
    'with-outline': !props.showOutline,
  }
})

const showLocalNav = computed(() => {
  return (hasSidebar.value || page.value.isBlogPost) && (!empty.value || y.value >= navHeight.value)
})
</script>

<template>
  <div v-if="showLocalNav" :class="classes">
    <button
      class="menu"
      :class="{ hidden: page.isBlogPost }"
      :disabled="page.isBlogPost"
      :aria-expanded="open"
      aria-controls="SidebarNav"
      @click="$emit('openMenu')"
    >
      <span class="vpi-align-left menu-icon" />
      <span class="menu-text"> {{ themeData.sidebarMenuLabel || 'Menu' }} </span>
    </button>

    <LocalNavOutlineDropdown v-if="showOutline" :headers="headers" :nav-height="navHeight" />
  </div>
</template>

<style scoped>
.local-nav {
  position: sticky;
  top: 0;

  /* rtl:ignore */
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: var(--vp-layout-top-height, 0);
  background-color: var(--vp-local-nav-bg-color);
  border-top: 1px solid var(--vp-c-gutter);
  border-bottom: 1px solid var(--vp-c-gutter);
  transition:
    border-color var(--t-color),
    background-color var(--t-color),
    border var(--t-color);
}

.local-nav.fixed {
  position: fixed;
}

.local-nav.reached-top {
  border-top-color: transparent;
}

@media (min-width: 960px) {
  .local-nav.is-blog {
    display: none;
  }

  .local-nav {
    top: var(--vp-nav-height);
    width: calc(100% - var(--vp-sidebar-width));
    margin-left: var(--vp-sidebar-width);
    border-top: none;
  }

  .local-nav .menu {
    visibility: hidden;
  }

  .local-nav.with-outline {
    display: none;
  }
}

@media (min-width: 1280px) {
  .local-nav {
    display: none;
  }
}

@media print {
  .local-nav {
    display: none;
  }
}

.menu {
  display: flex;
  align-items: center;
  padding: 12px 24px 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu.hidden {
  visibility: hidden;
}

.menu:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 768px) {
  .menu {
    padding: 12px 32px 11px;
  }
}

.menu-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  fill: currentcolor;
}

.top-link {
  display: block;
  padding: 12px 24px 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
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
