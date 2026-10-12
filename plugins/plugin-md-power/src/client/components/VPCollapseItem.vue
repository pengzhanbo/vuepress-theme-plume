<script setup lang="ts">
import type { Ref } from 'vue'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { inject, ref, useId, watch } from 'vue'
import { INJECT_COLLAPSE_KEY } from '../options.js'

import '@vuepress/helper/transition/fade-in-height-expand.css'

const { expand, index } = defineProps<{
  expand?: boolean
  index: number
}>()

const collapse = inject<{
  accordion: boolean
  index: Ref<number | undefined>
}>(INJECT_COLLAPSE_KEY)

if (__VUEPRESS_DEV__ && !collapse) {
  throw new Error('<VPCollapseItem /> must be used inside <VPCollapse />')
}

const expanded = ref(
  collapse?.accordion && typeof collapse.index.value !== 'undefined'
    ? index === collapse.index.value
    : expand,
)

const uid = useId()
const headerId = `${uid}-header`
const contentId = `${uid}-content`

if (collapse?.accordion) {
  watch(collapse?.index, () => {
    expanded.value = collapse?.index.value === index
  })
}

function toggle() {
  if (collapse?.accordion) {
    if (collapse.index.value === index && expanded.value) {
      expanded.value = false
    }
    else {
      collapse!.index.value = index!
      expanded.value = true
    }
  }
  else {
    expanded.value = !expanded.value
  }
}
</script>

<template>
  <div class="vp-collapse-item" :class="{ expanded }">
    <h3 class="vp-collapse-title">
      <button
        :id="headerId" type="button" class="vp-collapse-header"
        :aria-expanded="expanded" :aria-controls="contentId"
        @click="toggle"
      >
        <span class="vpi-chevron-right" aria-hidden="true" />
        <slot name="title" />
      </button>
    </h3>
    <FadeInExpandTransition>
      <div
        v-show="expanded" :id="contentId"
        class="vp-collapse-content" role="region" :aria-labelledby="headerId"
      >
        <div class="vp-collapse-content-inner">
          <slot />
        </div>
      </div>
    </FadeInExpandTransition>
  </div>
</template>

<style>
.vp-collapse-item {
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  border-top: solid 1px var(--vp-c-divider);
}

.vp-collapse-item:first-child {
  border-top: none;
}

.vp-collapse-header {
  display: flex;
  gap: 6px;
  align-items: center;
  width: 100%;
  padding: 0;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: inherit;
  text-align: start;
  cursor: pointer;
  background: none;
  border: none;
}

.vp-collapse-header:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.vp-collapse-header .vpi-chevron-right {
  align-self: baseline;
  width: 20px;
  height: 20px;
  transition: transform var(--vp-t-color);
  transform: rotate(0deg);
}

.vp-collapse-item.expanded .vpi-chevron-right {
  transform: rotate(90deg);
}

.vp-collapse-item .vp-collapse-title {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: 1;
}

.vp-collapse-content-inner {
  padding-top: 12px;
  padding-left: 24px;
}

.vp-collapse-content-inner > *:first-child {
  margin-top: 0;
}

.vp-collapse-content-inner > *:last-child {
  margin-bottom: 0;
}
</style>
