<script lang="ts" setup>
import { ref } from 'vue'
import { useFlyout } from '../../composables/flyout.js'
import VPIcon from '../VPIcon.vue'
import VMenu from './VMenu.vue'

defineProps<{
  prefixIcon?: string | { svg: string }
  icon?: any
  button?: string
  label?: string
  items?: any[]
}>()

const open = ref(false)
const el = ref<HTMLElement>()

useFlyout({ el, onBlur })

function onBlur() {
  open.value = false
}
</script>

<script lang="ts">
export default {

  name: 'Flyout',
}
</script>

<template>
  <div
    ref="el"
    class="flyout-wrapper"
    @mouseenter="open = true"
    @mouseleave="open = false"
  >
    <button
      type="button"
      class="button"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-label="label"
      @click="open = !open"
    >
      <span v-if="button || icon" class="text">
        <VPIcon v-if="prefixIcon" :name="prefixIcon" />
        <span v-if="icon" class="option-icon" :class="[icon]" />
        <span v-if="button" v-html="button" />
        <span class="vpi-chevron-down text-icon" />
      </span>

      <span v-else class="vpi-more-horizontal icon" />
    </button>

    <div class="menu">
      <VMenu :items="items">
        <slot />
      </VMenu>
    </div>
  </div>
</template>

<style scoped>
.flyout-wrapper {
  position: relative;
  transition: color var(--t-color);
}

.text {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentcolor;
  transition: fill var(--t-color);
}

.menu {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  right: 0;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.25s,
    visibility 0.25s,
    transform 0.25s;
}

.flyout-wrapper:hover {
  color: var(--vp-c-brand-1);
}

.flyout-wrapper:hover .text {
  color: var(--vp-c-text-2);
}

.flyout-wrapper:hover .icon {
  fill: var(--vp-c-text-2);
}

.flyout-wrapper.active .text {
  color: var(--vp-c-brand-1);
}

.flyout-wrapper.active:hover .text {
  color: var(--vp-c-brand-2);
}

.flyout-wrapper:hover .menu,
.button[aria-expanded="true"] + .menu {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.button[aria-expanded="false"] + .menu {
  visibility: hidden;
  opacity: 0;
  transform: translateY(0);
}

.button {
  display: flex;
  align-items: center;
  height: var(--vp-nav-height);
  padding: 0 10px;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.option-icon {
  margin-right: 0;
  font-size: 16px;
  fill: currentcolor;
}

.text-icon {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  fill: currentcolor;
}
</style>
