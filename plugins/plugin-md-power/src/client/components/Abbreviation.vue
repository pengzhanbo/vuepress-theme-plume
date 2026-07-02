<script setup lang="ts">
import { arrow, autoUpdate, offset, shift, useFloating } from '@floating-ui/vue'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

import '@vuepress/helper/transition/fade-in.css'

defineOptions({ inheritAttrs: false })

const abbr = useTemplateRef('abbr')
const tooltip = useTemplateRef('tooltip')
const tooltipArrow = useTemplateRef('tooltipArrow')

const isMobile = useMediaQuery('(max-width: 768px)')
const show = ref(false)

const showTooltip = () => show.value = true
const hideTooltip = () => show.value = false

onClickOutside(abbr, () => {
  if (isMobile.value)
    show.value = false
}, {
  ignore: [tooltip],
})
const { floatingStyles, middlewareData } = useFloating(abbr, tooltip, {
  whileElementsMounted: autoUpdate,
  placement: 'bottom',
  middleware: [
    offset(10),
    shift({ padding: 20 }),
    arrow({ element: tooltipArrow, padding: 4 }),
  ],
})
</script>

<template>
  <span
    ref="abbr" class="vp-abbr" role="tooltip" tabindex="0"
    v-bind="isMobile ? {
      onClick: () => show = !show,
      ...$attrs,
    } : {
      onMouseenter: showTooltip,
      onMouseleave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip,
      ...$attrs,
    }"
  ><slot /></span>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade-in">
        <span
          v-show="show" ref="tooltip"
          class="vp-abbr-tooltip ignore-header" :style="floatingStyles"
          aria-hidden="true"
          v-bind="!isMobile ? { onMouseenter: showTooltip, onMouseleave: hideTooltip } : undefined"
        >
          <span
            ref="tooltipArrow" class="tooltip-arrow" :style="{
              left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
              top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
            }"
          />
          <slot name="tooltip" />
        </span>
      </Transition>
    </Teleport>
  </ClientOnly>
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

.vp-abbr-tooltip {
  position: absolute;
  z-index: 3;
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
  transition: opacity var(--transition-duration) var(--transition-ease-in-out) !important;
  transform: var(--vp-abbr-transform);
}

.vp-abbr-tooltip .tooltip-arrow,
.vp-abbr-tooltip .tooltip-arrow::before {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  transform: var(--vp-abbr-space-transform);
}

.vp-abbr-tooltip .tooltip-arrow {
  top: -16px;
  left: 4px;
  border-bottom-color: var(--vp-abbr-border);
}

.vp-abbr-tooltip .tooltip-arrow::before {
  content: "";
  border-bottom-color: var(--vp-abbr-bg);
  transform: translate(-8px, -7px);
}
</style>
