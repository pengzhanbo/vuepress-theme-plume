<script lang="ts" setup>
import VPLocalNavOutlineDropdown from '@theme/VPLocalNavOutlineDropdown.vue'
import { useWindowScroll } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useBlogPageData, useData, useHeaders, useSidebar } from '../composables/index.js'

const props = defineProps<{
  open: boolean
  showOutline: boolean
}>()

defineEmits<(e: 'openMenu') => void>()

const { theme } = useData()
const { isBlogPost } = useBlogPageData()

const { hasSidebar } = useSidebar()
const { y } = useWindowScroll()

const navHeight = ref(0)

const headers = useHeaders()

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
    'vp-local-nav': true,
    'fixed': empty.value,
    'reached-top': y.value >= navHeight.value,
    'is-blog': isBlogPost,
    'with-outline': !props.showOutline,
  }
})

const showLocalNav = computed(() => {
  return (hasSidebar.value || isBlogPost.value) && (!empty.value || y.value >= navHeight.value)
})
</script>

<template>
  <div v-if="showLocalNav" :class="classes">
    <button
      class="menu" :class="{ hidden: isBlogPost }"
      :disabled="isBlogPost"
      :aria-expanded="open"
      aria-controls="SidebarNav"
      @click="$emit('openMenu')"
    >
      <span class="vpi-align-left menu-icon" />
      <span class="menu-text"> {{ theme.sidebarMenuLabel || 'Menu' }} </span>
    </button>

    <VPLocalNavOutlineDropdown v-if="showOutline" :headers="headers" :nav-height="navHeight" />
  </div>
</template>

<style scoped>
.vp-local-nav {
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
    border-color var(--vp-t-color),
    background-color var(--vp-t-color),
    border var(--vp-t-color);
}

.vp-local-nav.fixed {
  position: fixed;
}

.vp-local-nav.reached-top {
  border-top-color: transparent;
}

@media (min-width: 960px) {
  .vp-local-nav.is-blog {
    display: none;
  }

  .vp-local-nav {
    top: var(--vp-nav-height);
    width: calc(100% - var(--vp-sidebar-width));
    margin-left: var(--vp-sidebar-width);
    border-top: none;
  }

  .vp-local-nav .menu {
    visibility: hidden;
  }

  .vp-local-nav.with-outline {
    display: none;
  }
}

@media (min-width: 1280px) {
  .vp-local-nav {
    display: none;
  }
}

@media print {
  .vp-local-nav {
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
