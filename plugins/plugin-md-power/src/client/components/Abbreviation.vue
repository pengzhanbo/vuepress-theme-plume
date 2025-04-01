<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { onClickOutside, useMediaQuery, useToggle } from '@vueuse/core'
import { nextTick, ref, useTemplateRef, watch } from 'vue'

import '@vuepress/helper/transition/fade-in.css'

const [show, toggle] = useToggle(false)

const el = useTemplateRef<HTMLSpanElement>('el')
const tooltip = useTemplateRef<HTMLSpanElement>('tooltip')
const styles = ref<CSSProperties>()

const isMobile = useMediaQuery('(max-width: 768px)')
const showTooltip = () => toggle(true)
const hiddenTooltip = () => toggle(false)

onClickOutside(el, () => {
  if (isMobile.value)
    hiddenTooltip()
}, {
  ignore: [tooltip],
})

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
  <span
    ref="el"
    class="vp-abbr"
    role="tooltip"
    tabindex="0"
    v-bind="isMobile ? {
      onClick: showTooltip,
    } : {
      onMouseenter: showTooltip,
      onMouseleave: hiddenTooltip,
      onFocus: showTooltip,
      onBlur: hiddenTooltip,
    }"
  >
    <slot />
    <ClientOnly>
      <Transition name="fade-in">
        <span v-show="show" ref="tooltip" class="vp-abbr-tooltip ignore-header" :style="styles" aria-hidden="true">
          <slot name="tooltip" />
        </span>
      </Transition>
    </ClientOnly>
  </span>
</template>

<style>
:root {
  --vp-abbr-bg: var(--vp-c-bg);
  --vp-abbr-text: var(--vp-c-text-1);
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
  font-size: 14px;
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
