<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { nextTick, ref, useTemplateRef, watch } from 'vue'

const show = ref(false)
const tooltip = useTemplateRef<HTMLSpanElement>('tooltip')
const styles = ref<CSSProperties>()

watch(show, () => nextTick(() => {
  if (__VUEPRESS_SSR__)
    return

  if (show.value && tooltip.value) {
    const { x, width } = tooltip.value.getBoundingClientRect()
    const innerWidth = window.innerWidth
    const space = 16
    let translate = 0
    if (x - space < 0)
      translate = Math.abs(x) + space

    else if (x + width + space > innerWidth)
      translate = innerWidth - x - width - space

    if (translate !== 0) {
      styles.value = {
        '--vp-abbr-transform': `translateX(${translate}px) translateX(-50%)`,
        '--vp-abbr-space-transform': `translateX(${-translate}px) translateX(-50%)`,
      }
    }
  }
}))
</script>

<template>
  <span class="vp-abbr" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <Transition name="fade">
      <span v-show="show" ref="tooltip" class="vp-abbr-tooltip" :style="styles">
        <slot name="tooltip" />
      </span>
    </Transition>
  </span>
</template>

<style>
:root {
  --vp-abbr-bg: var(--vp-c-bg);
  --vp-abbr-text: var(--vp-c-text-2);
  --vp-abbr-border: var(--vp-c-divider);
  --vp-abbr-transform: translateX(-50%);
  --vp-abbr-space-transform: translateX(-50%);
}

.vp-abbr {
  position: relative;
  text-decoration: underline dotted currentcolor;
  text-underline-offset: 4px;
  cursor: help;
}

.vp-abbr .vp-abbr-tooltip {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  z-index: 1;
  width: max-content;
  max-width: min(calc(100vw - 32px), 360px);
  padding: 8px 14px;
  font-size: 0.875em;
  line-height: 1.7;
  color: var(--vp-abbr-text);
  cursor: auto;
  background-color: var(--vp-abbr-bg);
  border: solid 1px var(--vp-abbr-border);
  border-radius: 4px;
  box-shadow: var(--vp-shadow-2);
  transform: var(--vp-abbr-transform);
}

.vp-abbr .vp-abbr-tooltip::before,
.vp-abbr .vp-abbr-tooltip::after {
  position: absolute;
  top: -16px;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  content: "";
  border: 8px solid transparent;
  border-bottom-color: var(--vp-abbr-bg);
  transform: var(--vp-abbr-space-transform);
}

.vp-abbr .vp-abbr-tooltip::before {
  top: -17px;
  border-bottom-color: var(--vp-abbr-border);
}
</style>
