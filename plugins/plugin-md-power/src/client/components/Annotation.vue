<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

import '@vuepress/helper/transition/fade-in.css'

const props = defineProps<{
  label: string
  total: number
}>()

const active = ref(false)
const list = computed(() => Array.from({ length: props.total }, (_, i) => i))
const position = ref({ x: 0, y: 0 })

const popover = useTemplateRef<HTMLDivElement>('popover')
const button = useTemplateRef<HTMLButtonElement>('button')
onClickOutside(popover, () => (active.value = false), {
  ignore: [button],
})

function updatePosition() {
  if (__VUEPRESS_SSR__)
    return
  if (!active.value || !popover.value || !button.value)
    return
  const { x: _x, y: _y, width: w, height: h } = button.value.getBoundingClientRect()
  const x = _x + w / 2
  const y = _y + h / 2

  const { width, height } = popover.value.getBoundingClientRect()
  const { clientWidth, clientHeight } = document.documentElement
  position.value.x = x + width + 16 > clientWidth ? clientWidth - x - width - 16 : 0

  if (y > clientHeight - 16) {
    active.value = false
  }
  else {
    position.value.y = y + height + 16 > clientHeight ? clientHeight - y - height - 16 : 0
  }
}

watch(active, () => nextTick(updatePosition))
useEventListener('resize', updatePosition)
useEventListener('scroll', updatePosition, { passive: true })
</script>

<template>
  <span class="vp-annotation ignore-header" :class="{ active, [label]: true }">
    <span
      ref="button"
      :aria-label="label"
      class="vpi-annotation"
      @click="active = !active"
    />
    <ClientOnly>
      <Transition name="fade-in">
        <div
          v-show="active" ref="popover"
          class="annotations-popover" :class="{ list: list.length > 1 }"
          :style="{ '--vp-annotation-x': `${position.x}px`, '--vp-annotation-y': `${position.y}px` }"
        >
          <div v-for="i in list" :key="label + i" class="annotation">
            <slot :name="`item-${i}`" />
          </div>
        </div>
      </Transition>
    </ClientOnly>
  </span>
</template>

<style scoped>
.vp-annotation {
  position: relative;
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

.vp-annotation.active .vpi-annotation {
  transform: rotate(-45deg);
}

.annotations-popover {
  position: absolute;
  top: 50%;
  left: 50%;
  width: max-content;
  max-width: min(calc(100vw - 32px), 360px);
  max-height: 360px;
  padding: 8px 12px;
  overflow: auto;
  font-size: 14px;
  font-weight: normal;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-radius: 4px;
  box-shadow: var(--vp-shadow-2);
  transform: translateX(var(--vp-annotation-x, 0)) translateY(var(--vp-annotation-y, 0)) translateZ(0);
  will-change: transform;
}

.annotations-popover.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
}

.annotations-popover.list .annotation {
  padding: 4px 12px;
  background-color: var(--vp-c-bg);
  border-radius: 4px;
  box-shadow: var(--vp-shadow-1);
}

.annotations-popover :deep(p) {
  margin: 12px 0;
  line-height: 24px;
}

.annotations-popover :deep(:first-child) {
  margin-top: 4px;
}

.annotations-popover :deep(:last-child) {
  margin-bottom: 4px;
}

.annotations-popover.list :deep(:first-child) {
  margin-top: 8px;
}

.annotations-popover.list :deep(:last-child) {
  margin-bottom: 8px;
}
</style>
