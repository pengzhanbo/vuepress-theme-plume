<script setup lang="ts">
import type { PlotOptions } from '../../shared/index.js'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import { pluginOptions } from '../options.js'

const props = defineProps<Omit<PlotOptions, 'tag'>>()

const matter = usePageFrontmatter()

const options = computed(() => {
  const plot = typeof pluginOptions.plot === 'object' ? pluginOptions.plot : {}

  return {
    trigger: props.trigger || matter.value.plotTrigger || plot.trigger || 'hover',
    color: props.color || plot.color,
    mask: props.mask || plot.mask,
  }
})

const styles = computed(() => {
  const plot = options.value
  if (!plot.color && !plot.mask)
    return {}
  const style: Record<string, string> = {}
  if (plot.color) {
    if (typeof plot.color === 'string') {
      style['--vp-c-plot-light'] = plot.color
    }
    else {
      style['--vp-c-plot-light'] = plot.color.light
      style['--vp-c-plot-dark'] = plot.color.dark
    }
  }
  if (plot.mask) {
    if (typeof plot.mask === 'string') {
      style['--vp-c-bg-plot-light'] = plot.mask
    }
    else {
      style['--vp-c-bg-plot-light'] = plot.mask.light
      style['--vp-c-bg-plot-dark'] = plot.mask.dark
    }
  }
  return style
})

const isMobile = useMediaQuery('(max-width: 768px)')
const active = ref(false)
const el = shallowRef<HTMLElement>()

onClickOutside(el, () => {
  if (options.value.trigger === 'click' || isMobile.value)
    active.value = false
})

function onClick() {
  if (props.trigger === 'click' || isMobile.value)
    active.value = !active.value
}
</script>

<template>
  <span
    ref="el"
    class="vp-plot"
    :class="{ hover: options.trigger !== 'click', active }"
    :style="styles"
    @click="onClick"
  >
    <slot />
  </span>
</template>

<style>
.vp-plot {
  padding-right: 2px;
  padding-left: 2px;
  color: transparent;
  background-color: var(--vp-c-bg-plot-light, #000);
  transition: color ease 0.25s, background-color ease 0.25s;
}

[data-theme="dark"] .vp-plot {
  background-color: var(--vp-c-bg-plot-dark, #fff);
}

.vp-plot.hover:hover,
.vp-plot.active {
  color: var(--vp-c-plot-light, #fff);
}

[data-theme="dark"] .vp-plot.hover:hover,
[data-theme="dark"] .vp-plot.active {
  color: var(--vp-c-plot-dark, #000);
}
</style>
