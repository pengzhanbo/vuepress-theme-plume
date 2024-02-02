<script lang="ts" setup>
import { ref } from 'vue'
import { useFlyout } from '../../composables/flyout.js'
import IconChevronDown from '../icons/IconChevronDown.vue'
import IconMoreHorizontal from '../icons/IconMoreHorizontal.vue'
import VMenu from './VMenu.vue'

defineProps<{
  prefixIcon?: string
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
        <Icon v-if="prefixIcon" :name="prefixIcon" />
        <Component :is="icon" v-if="icon" class="option-icon" />
        {{ button }}
        <IconChevronDown class="text-icon" />
      </span>

      <IconMoreHorizontal v-else class="icon" />
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
  transition: color 0.25s;
}

.text {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentcolor;
  transition: fill 0.25s;
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

.button {
  display: flex;
  align-items: center;
  height: var(--vp-nav-height);
  padding: 0 10px;
  color: var(--vp-c-text-1);
  transition: color 0.5s;
}

.option-icon {
  width: 16px;
  height: 16px;
  margin-right: 0;
  fill: currentcolor;
}

.text-icon {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  fill: currentcolor;
}
</style>
