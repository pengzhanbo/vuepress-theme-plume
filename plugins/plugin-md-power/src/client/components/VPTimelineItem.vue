<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, inject } from 'vue'
import { INJECT_TIMELINE_KEY } from '../options.js'

const props = defineProps<{
  time?: string
  type?: 'info' | 'tip' | 'success' | 'warning' | 'danger' | 'caution' | 'important' | (string & {})
  card?: boolean
  line?: 'solid' | 'dashed' | 'dotted'
  icon?: string
  color?: string
  placement?: 'left' | 'right'
}>()

const is639 = useMediaQuery('(max-width: 639px)')

const defaultOptions = inject<ComputedRef<{
  line?: 'solid' | 'dashed' | 'dotted'
  card?: boolean
  horizontal?: boolean
  placement?: 'left' | 'right' | 'between'
}>>(INJECT_TIMELINE_KEY)

const timeline = computed(() => {
  const between = defaultOptions?.value.placement === 'between' && !is639.value
  const placement = defaultOptions?.value.placement === 'between' ? 'left' : defaultOptions?.value.placement
  return {
    time: props.time,
    type: props.type || 'info',
    line: props.line || defaultOptions?.value.line || 'solid',
    icon: props.icon,
    color: props.color,
    horizontal: defaultOptions?.value.horizontal ?? false,
    between: between ? props.placement || 'left' : false,
    placement: between ? '' : (placement || 'left'),
    card: props.card ?? defaultOptions?.value.card ?? false,
  }
})
</script>

<template>
  <div
    class="vp-timeline-item" :class="{
      card: timeline.card,
      horizontal: timeline.horizontal,
      [timeline.type]: true,
      [`line-${timeline.line}`]: true,
      [`placement-${timeline.placement}`]: !timeline.horizontal && timeline.placement,
      between: timeline.between,
      [`between-${timeline.between}`]: timeline.between,
    }"
    :style="timeline.color ? {
      '--vp-timeline-c-line': timeline.color,
      '--vp-timeline-c-point': timeline.color,
    } : null"
  >
    <div class="vp-timeline-line" :class="{ 'has-icon': timeline.icon }">
      <span class="vp-timeline-point">
        <slot name="icon">
          <VPIcon v-if="timeline.icon" :name="timeline.icon" />
        </slot>
      </span>
    </div>
    <div class="vp-timeline-container">
      <div class="vp-timeline-content">
        <p class="vp-timeline-title">
          <slot name="title" />
        </p>
        <slot />
      </div>
      <p v-if="timeline.time" class="vp-timeline-time">
        {{ timeline.time }}
      </p>
    </div>
  </div>
</template>

<style>
:root,
.vp-timeline-item.info {
  --vp-timeline-c-line: var(--vp-c-border);
  --vp-timeline-c-point: var(--vp-c-border);
  --vp-timeline-c-title: var(--vp-c-text-1);
  --vp-timeline-c-text: var(--vp-c-text-1);
  --vp-timeline-c-time: var(--vp-c-text-3);
  --vp-timeline-c-icon: var(--vp-c-bg);
  --vp-timeline-bg-card: var(--vp-c-bg-soft);
}

.vp-timeline-item.tip {
  --vp-timeline-c-line: var(--vp-c-tip-1);
  --vp-timeline-c-point: var(--vp-c-tip-1);
  --vp-timeline-bg-card: var(--vp-c-tip-soft);
}

.vp-timeline-item.success {
  --vp-timeline-c-line: var(--vp-c-success-3);
  --vp-timeline-c-point: var(--vp-c-success-3);
  --vp-timeline-bg-card: var(--vp-c-success-soft);
}

.vp-timeline-item.warning {
  --vp-timeline-c-line: var(--vp-c-warning-3);
  --vp-timeline-c-point: var(--vp-c-warning-3);
  --vp-timeline-bg-card: var(--vp-c-warning-soft);
}

.vp-timeline-item.danger {
  --vp-timeline-c-line: var(--vp-c-danger-3);
  --vp-timeline-c-point: var(--vp-c-danger-3);
  --vp-timeline-bg-card: var(--vp-c-danger-soft);
}

.vp-timeline-item.caution {
  --vp-timeline-c-line: var(--vp-c-caution-3);
  --vp-timeline-c-point: var(--vp-c-caution-3);
  --vp-timeline-bg-card: var(--vp-c-caution-soft);
}

.vp-timeline-item.important {
  --vp-timeline-c-line: var(--vp-c-important-3);
  --vp-timeline-c-point: var(--vp-c-important-3);
  --vp-timeline-bg-card: var(--vp-c-important-soft);
}

.vp-timeline-item {
  position: relative;
  display: flex;
}

.vp-timeline-item:not(.horizontal).between {
  width: calc(50% - 18px);
}

.vp-timeline-item.horizontal {
  padding-top: 36px;
}

.vp-timeline-item > .vp-timeline-line {
  position: absolute;
}

.vp-timeline-item:not(.horizontal).placement-left {
  justify-content: flex-start;
  padding-left: 36px;
}

.vp-timeline-item:not(.horizontal).placement-right,
.vp-timeline-item:not(.horizontal).between {
  justify-content: flex-end;
  padding-right: 36px;
  text-align: right;
}

.vp-timeline-item:not(.horizontal) > .vp-timeline-line {
  top: 0;
  bottom: 0;
  width: 0;
}

.vp-timeline-item.horizontal > .vp-timeline-line {
  top: 12px;
  right: 0;
  left: 0;
  height: 0;
}

.vp-timeline-item:not(.horizontal).card > .vp-timeline-line {
  top: 14px;
}

.vp-timeline-item:not(.horizontal).placement-left > .vp-timeline-line {
  left: 12px;
}

.vp-timeline-item:not(.horizontal).placement-right > .vp-timeline-line,
.vp-timeline-item:not(.horizontal).between > .vp-timeline-line {
  right: 12px;
}

.vp-timeline-item > .vp-timeline-line::before {
  position: absolute;
  display: block;
  content: "";
  border: none;
}

.vp-timeline-item:not(.horizontal) > .vp-timeline-line::before {
  top: 10px;
  bottom: -48px;
  border-left: 2px solid var(--vp-timeline-c-line);
}

.vp-timeline-item.horizontal > .vp-timeline-line::before {
  right: -46px;
  left: 8px;
  border-top: 2px solid var(--vp-timeline-c-line);
}

.vp-timeline-item:not(.horizontal):last-of-type > .vp-timeline-line::before {
  bottom: 0 !important;
}

.vp-timeline-item.horizontal:last-of-type > .vp-timeline-line::before {
  right: 0 !important;
}

.vp-timeline-item:not(.horizontal).line-dashed > .vp-timeline-line::before {
  border-left-style: dashed;
}

.vp-timeline-item:not(.horizontal).line-dotted > .vp-timeline-line::before {
  border-left-style: dotted;
}

.vp-timeline-item.horizontal.line-dashed > .vp-timeline-line::before {
  border-top-style: dashed;
}

.vp-timeline-item.horizontal.line-dotted > .vp-timeline-line::before {
  border-top-style: dotted;
}

.vp-timeline-item > .vp-timeline-line .vp-timeline-point {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: var(--vp-timeline-c-point);
  border-radius: 50%;
  transition: background-color var(--vp-t-color);
}

.vp-timeline-item:not(.horizontal) > .vp-timeline-line .vp-timeline-point {
  top: 4px;
  left: -7px;
}

.vp-timeline-item.horizontal > .vp-timeline-line .vp-timeline-point {
  top: -7px;
  left: 0;
}

.vp-timeline-item > .vp-timeline-line.has-icon .vp-timeline-point {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.vp-timeline-item:not(.horizontal) > .vp-timeline-line.has-icon .vp-timeline-point {
  top: -1px;
  left: -11px;
}

.vp-timeline-item.horizontal > .vp-timeline-line.has-icon .vp-timeline-point {
  top: -11px;
  left: 0;
}

.vp-timeline-item > .vp-timeline-line.has-icon .vp-timeline-point .vp-icon {
  width: 16px;
  height: 16px;
  margin: 0;
  color: var(--vp-timeline-c-icon);
}

.vp-timeline-item .vp-timeline-container {
  width: max-content;
  max-width: 100%;
  font-size: 16px;
  line-height: 1.5;
  color: var(--vp-timeline-c-text);
  transition: color var(--vp-t-color);
}

.vp-timeline-item.horizontal .vp-timeline-container {
  max-width: 240px;
}

.vp-timeline-item:not(.horizontal).between-right .vp-timeline-container {
  text-align: left;
  transform: translateX(calc(100% + 48px));
}

.vp-timeline-item.card .vp-timeline-content {
  padding: 16px;
  background-color: var(--vp-timeline-bg-card);
  border-radius: 6px;
}

.vp-timeline-item .vp-timeline-content :where(p, ul, ol) {
  margin: 8px 0;
  line-height: 22px;
}

.vp-doc .vp-timeline-item .vp-timeline-content div[class*="language-"] {
  margin: 16px 0;
}

.vp-timeline-item .vp-timeline-content li + li {
  margin-top: 4px;
}

.vp-timeline-item .vp-timeline-content .vp-timeline-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 900;
  color: var(--vp-timeline-c-title);
  transition: color var(--vp-t-color);
}

.vp-timeline-item .vp-timeline-content > .vp-timeline-title + * {
  margin-top: 0 !important;
}

.vp-timeline-item .vp-timeline-content > :last-child {
  margin-bottom: 0 !important;
}

.vp-timeline-item .vp-timeline-time {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-timeline-c-time);
  transition: color var(--vp-t-color);
}
</style>
