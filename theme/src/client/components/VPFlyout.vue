<script lang="ts" setup>
import type { ThemeBadge, ThemeIcon } from '../../shared/index.js'
import VPBadge from '@theme/global/VPBadge.vue'
import VPIcon from '@theme/VPIcon.vue'
import VPMenu from '@theme/VPMenu.vue'
import { ref } from 'vue'
import { useFlyout } from '../composables/index.js'

defineProps<{
  prefixIcon?: ThemeIcon
  icon?: any
  button?: string
  label?: string
  items?: any[]
  badge?: string | ThemeBadge
}>()

const open = ref(false)
const el = ref<HTMLElement>()

useFlyout({ el, onBlur })

function onBlur() {
  open.value = false
}
</script>

<template>
  <div
    ref="el"
    class="vp-flyout"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focus="open = true"
    @blur="open = false"
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
        <VPBadge v-if="badge" class="vp-menu-badge" v-bind="typeof badge === 'string' ? { text: badge } : badge" />
        <span class="vpi-chevron-down text-icon" />
      </span>

      <span v-else class="vpi-more-horizontal icon" />
    </button>

    <div class="menu">
      <VPMenu :items="items">
        <slot />
      </VPMenu>
    </div>
  </div>
</template>

<style scoped>
.vp-flyout {
  position: relative;
  transition: color var(--vp-t-color);
}

.text {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentcolor;
  transition: fill var(--vp-t-color);
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

.vp-flyout:hover {
  color: var(--vp-c-brand-1);
}

.vp-flyout:hover .text {
  color: var(--vp-c-text-2);
}

.vp-flyout:hover .icon {
  fill: var(--vp-c-text-2);
}

.vp-flyout.active .text {
  color: var(--vp-c-brand-1);
}

.vp-flyout.active:hover .text {
  color: var(--vp-c-brand-2);
}

.vp-flyout:hover .menu,
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
  transition: color var(--vp-t-color);
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

.vp-flyout :deep(.vp-menu-badge) {
  transform: translateY(0);
}
</style>
