<script setup lang="ts">
import type { MenuItem } from '../composables/index.js'
import VPDocOutlineItem from '@theme/VPDocOutlineItem.vue'
import { onClickOutside } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { useData } from '../composables/index.js'

const props = defineProps<{
  headers: MenuItem[]
  navHeight: number
}>()

const { theme } = useData()
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
    if (items.value)
      items.value.style.transition = 'none'

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
  <div class="vp-local-nav-outline-dropdown" :style="{ '--vp-vh': `${vh}px` }">
    <button v-if="headers.length > 0" ref="btn" :class="{ open }" @click="toggle">
      {{ theme.outlineLabel || 'On this page' }}
      <span class="vpi-chevron-right icon" />
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
          <VPDocOutlineItem :headers="headers" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.vp-local-nav-outline-dropdown {
  padding: 12px 20px 11px;
}

.vp-local-nav-outline-dropdown button {
  position: relative;
  display: block;
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-local-nav-outline-dropdown button:hover {
  color: var(--vp-c-text-1);
}

.vp-local-nav-outline-dropdown button.open {
  color: var(--vp-c-text-1);
}

.icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  vertical-align: middle;
  fill: currentcolor;
}

:deep(.outline-link) {
  padding: 2px 0;
  font-size: 14px;
}

.open > .icon {
  transform: rotate(90deg);
}

.items {
  position: absolute;
  top: 64px;
  right: 16px;
  left: 16px;
  display: grid;
  gap: 1px;
  max-height: calc(var(--vp-vh, 100vh) - 86px);
  overflow: hidden auto;
  background-color: var(--vp-c-gutter);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-3);
  transition: var(--vp-t-color);
  transition-property: background-color, border, box-shadow;
}

.header {
  background-color: var(--vp-c-bg-soft);
}

.top-link {
  display: block;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 48px;
  color: var(--vp-c-brand-1);
}

.outline {
  padding: 8px 0;
  background-color: var(--vp-c-bg-soft);
}

.flyout-enter-active {
  transition: all 0.2s ease-out;
}

.flyout-leave-active {
  transition: all 0.15s ease-in;
}

.flyout-enter-from,
.flyout-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
