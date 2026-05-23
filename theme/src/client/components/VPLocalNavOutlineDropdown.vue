<script setup lang="ts">
import type { MenuItem } from '../composables/index.js'
import VPDocOutlineItem from '@theme/VPDocOutlineItem.vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { onContentUpdated } from 'vuepress/client'
import { useData } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in-scale-up.css'
import '@vuepress/helper/transition/fade-in.css'

const { headers, navHeight } = defineProps<{
  headers: MenuItem[]
  navHeight: number
}>()

const { theme } = useData()
const open = ref(false)
const vh = ref(0)
const items = ref<HTMLDivElement>()
const btn = ref<HTMLButtonElement>()

watch(() => headers, () => {
  open.value = false
})

onClickOutside(items, () => {
  open.value = false
}, { ignore: [btn] })

onKeyStroke('Escape', () => {
  open.value = false
})

onContentUpdated(() => {
  open.value = false
})

function toggle() {
  open.value = !open.value
  vh.value = window.innerHeight + Math.min(window.scrollY - navHeight, 0)
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
</script>

<template>
  <div class="vp-local-nav-outline-dropdown" :style="{ '--vp-vh': `${vh}px` }">
    <button v-if="headers.length > 0" ref="btn" :class="{ open }" @click="toggle">
      {{ theme.outlineLabel || 'On this page' }}
      <span class="vpi-chevron-right icon" />
    </button>
    <Transition name="fade-in">
      <div v-if="open" class="outline-mask" />
    </Transition>
    <Transition name="fade-in-scale-up">
      <div v-if="open" ref="items" class="items" @click="onItemClick">
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

.outline-mask {
  position: absolute;
  top: 48px;
  right: 0;
  left: 0;
  height: calc(100vh - 49px);
  background-color: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
  backdrop-filter: blur(3px);
}

.items {
  position: absolute;
  top: 48px;
  right: 0;
  display: grid;
  gap: 1px;
  min-width: 50vw;
  max-width: 100%;
  max-height: calc(var(--vp-vh, 100vh) - 86px);
  overflow: hidden auto;
  background-color: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
  backdrop-filter: blur(25px);
  border-bottom-left-radius: 8px;
  box-shadow: var(--vp-shadow-3);
  transition: var(--vp-t-color);
  transition-property: background-color, border, box-shadow;
}

.outline {
  padding: 8px 0;
  padding-right: 16px;
  background-color: var(--vp-c-bg);
}
</style>
