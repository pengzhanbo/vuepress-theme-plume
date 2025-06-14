<script setup lang="ts">
import type { PlotOptions } from '../../shared/index.js'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import { pluginOptions } from '../options.js'

const props = defineProps<PlotOptions>()

const matter = usePageFrontmatter()
const isMobile = useMediaQuery('(max-width: 768px)')

const plot = computed(() => {
  const global = typeof pluginOptions.plot === 'object' ? pluginOptions.plot : {}
  const current = (typeof matter.value.plot === 'object' ? matter.value.plot : {}) as PlotOptions
  return {
    trigger: isMobile.value ? 'click' : props.trigger ?? current.trigger ?? global.trigger ?? 'hover',
    effect: props.effect ?? current.effect ?? global.effect ?? 'mask',
  }
})
const active = ref(false)
const el = useTemplateRef<HTMLElement>('el')
const classes = ref<string[]>([])

onMounted(() => {
  if (!el.value)
    return
  const classList = el.value.classList
  if (!classList.contains('hover') && !classList.contains('click')) {
    classes.value.push(plot.value.trigger)
  }
  if (!classList.contains('mask') && !classList.contains('blur')) {
    classes.value.push(plot.value.effect)
  }
})

onClickOutside(el, () => {
  if (plot.value.trigger === 'click' || el.value?.classList.contains('click'))
    active.value = false
})

function onClick() {
  if (plot.value.trigger === 'click' || el.value?.classList.contains('click'))
    active.value = !active.value
}
</script>

<template>
  <span
    ref="el"
    class="vp-plot"
    :class="[{ active }, ...classes]"
    @click="onClick"
  >
    <slot />
  </span>
</template>

<style>
:root {
  --vp-plot-bg: var(--vp-c-text-1);
  --vp-plot-c-text: var(--vp-c-neutral-inverse);
  --vp-plot-blur: 0.2rem;
}

.vp-plot {
  padding-right: 2px;
  padding-left: 2px;
}

.vp-plot.click {
  cursor: pointer;
}

.vp-plot:where(.blur) {
  filter: blur(var(--vp-plot-blur));
  transition: filter var(--vp-t-color);
}

.vp-plot:where(.mask) {
  color: transparent;
  background-color: var(--vp-plot-bg);
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.vp-plot:where(.blur.hover):hover,
.vp-plot:where(.blur).active {
  filter: blur(0);
}

.vp-plot:where(.mask.hover):hover,
.vp-plot:where(.mask).active {
  color: var(--vp-plot-c-text);
}
</style>
