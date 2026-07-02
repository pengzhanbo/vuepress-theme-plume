<script setup lang="ts">
import { autoUpdate, flip, shift, useFloating } from '@floating-ui/vue'
import { onClickOutside, useIntersectionObserver } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'

import '@vuepress/helper/transition/fade-in.css'

defineOptions({ inheritAttrs: false })

const { label, total } = defineProps<{
  label: string
  total: number
}>()

const active = ref(false)
const group = computed(() => Array.from({ length: total }, (_, i) => i))

const annotation = useTemplateRef('annotation')
const tooltip = useTemplateRef('tooltip')

onClickOutside(annotation, () => (active.value = false), { ignore: [tooltip] })

useIntersectionObserver(annotation as any, ([entry]) => {
  if (!entry.isIntersecting && active.value)
    active.value = false
}, { rootMargin: '-64px 0px 0px 0px' })

const { floatingStyles, placement } = useFloating(annotation, tooltip, {
  whileElementsMounted: autoUpdate,
  middleware: [
    flip(),
    shift({ padding: { top: 80, left: 16, bottom: 16 } }),
  ],
})

const inset = computed(() => placement.value.split('-')[0])
</script>

<template>
  <span
    v-bind="$attrs" ref="annotation"
    class="vp-annotation ignore-header" :class="{ active, [inset]: true }"
    :aria-label="label" :aria-expanded="active"
    @click="active = !active"
  >
    <span class="vpi-annotation" />
  </span>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade-in">
        <div
          v-if="active" ref="tooltip"
          class="vp-annotation-popover" :class="{ group: group.length > 1 }"
          :style="floatingStyles"
        >
          <div v-for="i in group" :key="label + i" class="annotation">
            <slot :name="`item-${i}`" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.vp-annotation {
  position: relative;
  z-index: 10;
}

.vpi-annotation {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10a10 10 0 0 1-4.262-.951l-4.537.93a1 1 0 0 1-1.18-1.18l.93-4.537A10 10 0 0 1 2 12m10-4a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2V9a1 1 0 0 1 1-1' clip-rule='evenodd'/%3E%3C/svg%3E");

  position: relative;
  top: -2px;
  z-index: 2;
  width: 1.5em;
  height: 1.5em;
  color: currentcolor;
  cursor: pointer;
  opacity: 0.5;
  transition: color var(--vp-t-color), opacity var(--vp-t-color), transform var(--vp-t-color);
  transform: rotate(0deg);
}

@media print {
  .vpi-annotation {
    display: none;
  }
}

.vp-annotation.active {
  z-index: 10;
}

.vp-annotation:where(:hover, .active) .vpi-annotation {
  color: var(--vp-c-brand-2);
  opacity: 1;
}

.vp-annotation.active.top .vpi-annotation {
  transform: rotate(135deg);
}

.vp-annotation.active.left .vpi-annotation {
  transform: rotate(45deg);
}

.vp-annotation.active.bottom .vpi-annotation {
  transform: rotate(-45deg);
}

.vp-annotation.active.right .vpi-annotation {
  transform: rotate(-135deg);
}

.vp-annotation-popover {
  position: absolute;
  z-index: 9;
  box-sizing: border-box;
  width: max-content;
  max-width: min(calc(100vw - 40px), 360px);
  max-height: 360px;
  padding: 8px 12px;
  overflow: auto;
  font-size: 14px;
  font-weight: normal;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-radius: 4px;
  box-shadow: var(--vp-shadow-2);
  transition: opacity var(--transition-duration) var(--transition-ease-in-out) !important;
}

.vp-annotation-popover.group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
}

.vp-annotation-popover.group .annotation {
  padding: 4px 12px;
  background-color: var(--vp-c-bg);
  border-radius: 4px;
  box-shadow: var(--vp-shadow-1);
}

.vp-annotation-popover :deep(p) {
  margin: 12px 0;
  line-height: 24px;
}

.vp-annotation-popover :deep(:first-child) {
  margin-top: 4px;
}

.vp-annotation-popover :deep(:last-child) {
  margin-bottom: 4px;
}

.vp-annotation-popover.group :deep(:first-child) {
  margin-top: 8px;
}

.vp-annotation-popover.group :deep(:last-child) {
  margin-bottom: 8px;
}
</style>
