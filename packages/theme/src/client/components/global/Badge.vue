<script setup lang="ts">
interface Props {
  text?: string
  type?: 'info' | 'tip' | 'warning' | 'danger'
}
withDefaults(defineProps<Props>(), {
  type: 'tip',
  text: undefined
})
</script>

<template>
  <span class="badge-view" :class="type">
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.badge-view {
  display: inline-block;
  margin-left: 2px;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 10px;
  line-height: 22px;
  font-size: 12px;
  font-weight: 500;
  transform: translateY(-2px);
}

h1 .badge-view,
h2 .badge-view,
h3 .badge-view,
h4 .badge-view,
h5 .badge-view,
h6 .badge-view {
  vertical-align: top;
}

h2 .badge-view {
  border-radius: 11px;
  line-height: 20px;
}

.badge-view.info {
  border-color: var(--vp-badge-info-border);
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.badge-view.tip {
  border-color: var(--vp-badge-tip-border);
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.badge-view.warning {
  border-color: var(--vp-badge-warning-border);
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.badge-view.danger {
  border-color: var(--vp-badge-danger-border);
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}
</style>
