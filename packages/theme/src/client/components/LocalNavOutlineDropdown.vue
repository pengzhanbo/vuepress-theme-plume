<script setup lang="ts">
import type {PageHeader} from '@vuepress/client';
import {onClickOutside} from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { useThemeLocaleData } from '../composables/index.js'
import DocOutlineItem from './DocOutlineItem.vue'
import IconChevronRight from './icons/IconChevronRight.vue'

const props = defineProps<{
  headers: PageHeader[]
  navHeight: number
}>()

const theme = useThemeLocaleData()
const open = ref(false)
const vh = ref(0)
const items = ref<HTMLDivElement>()
const btn = ref<HTMLButtonElement>()

watch(() => props.headers, () => {
  open.value = false
})

onClickOutside(items, () => {
  open.value = false
}, { ignore: [btn] })

function toggle() {
  open.value = !open.value
  vh.value = window.innerHeight + Math.min(window.scrollY - props.navHeight, 0)
}

function onItemClick(e: Event) {
  if ((e.target as HTMLElement).classList.contains('outline-link')) {
    // disable animation on hash navigation when page jumps
    if (items.value) {
      items.value.style.transition = 'none'
    }
    nextTick(() => {
      open.value = false
    })
  }
}

function scrollToTop() {
  open.value = false
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="local-nav-outline-dropdown" :style="{ '--vp-vh': vh + 'px' }">
    <button v-if="headers.length > 0" ref="btn" :class="{ open }" @click="toggle">
      {{ 'On this page' }}
      <IconChevronRight class="icon" />
    </button>
    <button v-else @click="scrollToTop">
      {{ theme.returnToTopLabel || 'Return to top' }}
    </button>
    <Transition name="flyout">
      <div v-if="open" ref="items" class="items" @click="onItemClick">
        <div class="header">
          <a class="top-link" href="#" @click="scrollToTop">
            {{ theme.returnToTopLabel || 'Return to top' }}
          </a>
        </div>
        <div class="outline">
          <DocOutlineItem :headers="headers" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.local-nav-outline-dropdown {
  padding: 12px 20px 11px;
}

.local-nav-outline-dropdown button {
  display: block;
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
  position: relative;
}

.local-nav-outline-dropdown button:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.local-nav-outline-dropdown button.open {
  color: var(--vp-c-text-1);
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
  width: 14px;
  height: 14px;
  fill: currentColor;
}

:deep(.outline-link) {
  font-size: 14px;
  padding: 2px 0;
}

.open>.icon {
  transform: rotate(90deg);
}

.items {
  position: absolute;
  top: 64px;
  right: 16px;
  left: 16px;
  display: grid;
  /* gap: 1px; */
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background-color: var(--vp-c-gutter);
  max-height: calc(var(--vp-vh, 100vh) - 86px);
  overflow: hidden auto;
  box-shadow: var(--vp-shadow-3);
}

.header {
  background-color: var(--vp-c-bg-soft);
}

.top-link {
  display: block;
  padding: 0 16px;
  line-height: 48px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.outline {
  padding: 8px 0;
  background-color: var(--vp-c-bg-soft);
}

.flyout-enter-active {
  transition: all .2s ease-out;
}

.flyout-leave-active {
  transition: all .15s ease-in;
}

.flyout-enter-from,
.flyout-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
