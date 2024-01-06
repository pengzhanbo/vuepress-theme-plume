<script setup lang="ts">
interface Props {
  text?: string
  type?: 'info' | 'tip' | 'warning' | 'danger'
}
withDefaults(defineProps<Props>(), {
  type: 'tip',
  text: undefined,
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
  padding: 0 10px;
  margin-left: 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
  border: 1px solid transparent;
  border-radius: 12px;
  transform: translateY(-2px);
}

h1 .badge-view {
  margin-top: 4px;
  vertical-align: top;
}

h2 .badge-view {
  padding: 0 8px;
  margin-top: 3px;
  vertical-align: top;
}

h3 .badge-view {
  vertical-align: middle;
}

h4 .badge-view,
h5 .badge-view,
h6 .badge-view {
  line-height: 18px;
  vertical-align: middle;
}

.badge-view.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
  border-color: var(--vp-badge-info-border);
}

.badge-view.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
  border-color: var(--vp-badge-tip-border);
}

.badge-view.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
  border-color: var(--vp-badge-warning-border);
}

.badge-view.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
  border-color: var(--vp-badge-danger-border);
}
</style>
