<script setup lang="ts">
import { Transition, TransitionGroup } from 'vue'

const props = defineProps<{
  group?: boolean
  appear?: boolean
  mode?: 'in-out' | 'out-in' | 'default'
  onLeave?: () => void
  onAfterLeave?: () => void
  onAfterEnter?: () => void
  width?: boolean
}>()

function handleBeforeLeave(el: HTMLElement): void {
  if (props.width) {
    el.style.maxWidth = `${el.offsetWidth}px`
  }
  else {
    el.style.maxHeight = `${el.offsetHeight}px`
  }
  void el.offsetWidth
}

function handleLeave(el: HTMLElement): void {
  if (props.width) {
    el.style.maxWidth = '0'
  }
  else {
    el.style.maxHeight = '0'
  }
  void el.offsetWidth
  props.onLeave?.()
}

function handleAfterLeave(el: HTMLElement): void {
  if (props.width) {
    el.style.maxWidth = ''
  }
  else {
    el.style.maxHeight = ''
  }
  props.onAfterLeave?.()
}

function handleEnter(el: HTMLElement): void {
  el.style.transition = 'none'
  if (props.width) {
    const memorizedWidth = el.offsetWidth
    el.style.maxWidth = '0'
    void el.offsetWidth
    el.style.transition = ''
    el.style.maxWidth = `${memorizedWidth}px`
  }
  else {
    const memorizedHeight = el.offsetHeight
    el.style.maxHeight = '0'
    void el.offsetWidth
    el.style.transition = ''
    el.style.maxHeight = `${memorizedHeight}px`
  }
  void el.offsetWidth
}

function handleAfterEnter(el: HTMLElement): void {
  if (props.width) {
    el.style.maxWidth = ''
  }
  else {
    el.style.maxHeight = ''
  }
  props.onAfterEnter?.()
}
</script>

<template>
  <component
    :is="group ? TransitionGroup : Transition"
    :name="width ? 'fade-in-width-expand' : 'fade-in-height-expand'"
    :mode
    :appear
    @enter="handleEnter"
    @after-enter="handleAfterEnter"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
    @after-leave="handleAfterLeave"
  >
    <slot />
  </component>
</template>

<style>
.fade-in-height-expand-leave-from,
.fade-in-height-expand-enter-to,
.fade-in-width-expand-leave-from,
.fade-in-width-expand-enter-to {
  opacity: 1;
}

.fade-in-height-expand-leave-to,
.fade-in-height-expand-enter-from {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  opacity: 0;
}

.fade-in-height-expand-leave-active {
  overflow: hidden;
  transition:
    max-height cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    opacity cubic-bezier(0, 0, 0.2, 1) 0.3s,
    margin-top cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    margin-bottom cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    padding-top cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    padding-bottom cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.fade-in-height-expand-enter-active {
  overflow: hidden;
  transition:
    max-height cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    opacity cubic-bezier(0.4, 0, 1, 1) 0.3s,
    margin-top cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    margin-bottom cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    padding-top cubic-bezier(0.4, 0, 0.2, 1) 0.3s,
    padding-bottom cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.fade-in-width-expand-leave-to,
.fade-in-width-expand-enter-from {
  margin-right: 0 !important;
  margin-left: 0 !important;
  opacity: 0 !important;
}

.fade-in-width-expand-leave-active {
  overflow: hidden;
  transition:
    max-width cubic-bezier(0.4, 0, 0.2, 1) 0.2s 0.1s,
    opacity cubic-bezier(0.4, 0, 0.2, 1) 0.2s,
    margin-right cubic-bezier(0.4, 0, 0.2, 1) 0.2s 0.1s,
    margin-left cubic-bezier(0.4, 0, 0.2, 1) 0.2s 0.1s;
}

.fade-in-width-expand-enter-active {
  overflow: hidden;
  transition:
    max-width cubic-bezier(0.4, 0, 0.2, 1) 0.2s,
    opacity cubic-bezier(0.4, 0, 0.2, 1) 0.2s 0.1s,
    margin-right cubic-bezier(0.4, 0, 0.2, 1) 0.2s,
    margin-left cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}
</style>
