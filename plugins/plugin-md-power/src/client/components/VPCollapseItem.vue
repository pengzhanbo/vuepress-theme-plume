<script setup lang="ts">
import type { Ref } from 'vue'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { inject, ref, watch } from 'vue'
import { INJECT_COLLAPSE_KEY } from '../options.js'

import '@vuepress/helper/transition/fade-in-height-expand.css'

const props = defineProps<{
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

const expand = ref(
  collapse?.accordion && typeof collapse.index.value !== 'undefined'
    ? props.index === collapse.index.value
    : props.expand,
)

if (collapse?.accordion) {
  watch(collapse?.index, () => {
    expand.value = collapse?.index.value === props.index
  })
}

function toggle() {
  if (collapse?.accordion) {
    if (collapse.index.value === props.index && expand.value) {
      expand.value = false
    }
    else {
      collapse!.index.value = props.index!
      expand.value = true
    }
  }
  else {
    expand.value = !expand.value
  }
}
</script>

<template>
  <div class="vp-collapse-item" :class="{ expand }">
    <div class="vp-collapse-header" @click="toggle">
      <span class="vpi-chevron-right" />
      <p class="vp-collapse-title">
        <slot name="title" />
      </p>
    </div>
    <FadeInExpandTransition>
      <div v-show="expand" class="vp-collapse-content">
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
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.vp-collapse-header .vpi-chevron-right {
  align-self: baseline;
  width: 20px;
  height: 20px;
  transition: transform var(--vp-t-color);
  transform: rotate(0deg);
}

.vp-collapse-item.expand .vpi-chevron-right {
  transform: rotate(90deg);
}

.vp-collapse-header .vp-collapse-title {
  flex: 1 2;
  margin: 0;
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
