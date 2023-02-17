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
  // eslint-disable-next-line vue/match-component-file-name
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
}

.flyout-wrapper:hover {
  color: var(--vp-c-brand);
  transition: color 0.25s;
}

.flyout-wrapper:hover .text {
  color: var(--vp-c-text-2);
}

.flyout-wrapper:hover .icon {
  fill: var(--vp-c-text-2);
}

.flyout-wrapper.active .text {
  color: var(--vp-c-brand);
}

.flyout-wrapper.active:hover .text {
  color: var(--vp-c-brand-dark);
}

.flyout-wrapper:hover .menu,
.button[aria-expanded='true'] + .menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.button {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color 0.5s;
}

.text {
  display: flex;
  align-items: center;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.option-icon {
  margin-right: 0px;
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.text-icon {
  margin-left: 4px;
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transition: fill 0.25s;
}

.menu {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s, visibility 0.25s, transform 0.25s;
}
</style>
