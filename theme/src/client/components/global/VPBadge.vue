<script setup lang="ts">
import type { ThemeBadge } from '../../../shared/index.js'
import { computed } from 'vue'

const { type = 'tip', text, color, bgColor, borderColor = 'transparent' } = defineProps<ThemeBadge>()

const customStyle = computed(() => {
  if (color || bgColor) {
    return {
      color,
      backgroundColor: bgColor,
      borderColor,
    }
  }
  return {}
})
</script>

<template>
  <span class="vp-badge" :class="type" :style="customStyle">
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.vp-badge {
  display: inline-block;
  padding: 0 10px;
  margin-left: 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: var(--vp-t-color);
  transition-property: color, background-color, border-color;
  transform: translateY(-2px);
}

h1 .vp-badge {
  margin-top: 4px;
  vertical-align: top;
}

h2 .vp-badge {
  padding: 0 8px;
  margin-top: 3px;
  vertical-align: top;
}

h3 .vp-badge {
  vertical-align: middle;
}

h4 .vp-badge,
h5 .vp-badge,
h6 .vp-badge {
  line-height: 18px;
  vertical-align: middle;
}

.vp-badge.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
  border-color: var(--vp-badge-info-border);
}

.vp-badge.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
  border-color: var(--vp-badge-tip-border);
}

.vp-badge.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
  border-color: var(--vp-badge-warning-border);
}

.vp-badge.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
  border-color: var(--vp-badge-danger-border);
}
</style>
