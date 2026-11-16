<script setup lang="ts">
import VPLink from '@theme/VPLink.vue'
import { useSeries } from '../composables/index.js'

const { enabled, series, name, next, nextLabel, finishedLabel, navLabel } = useSeries()
</script>

<template>
  <aside v-if="enabled" class="vp-series-next" :aria-label="navLabel">
    <p class="series-next-head">
      <span class="vpi-series icon" aria-hidden="true" />
      <VPLink
        v-if="series?.link"
        class="series-name"
        :href="series.link"
        :aria-label="`${series.title} — ${navLabel}`"
      >
        {{ name }}
      </VPLink>
      <span v-else class="series-name">{{ name }}</span>
      <template v-if="!next">
        <span class="divider" aria-hidden="true">·</span>
        <span class="done">{{ finishedLabel }}</span>
      </template>
    </p>

    <VPLink v-if="next" class="series-next-card" :href="next.path">
      <span class="series-next-label">{{ nextLabel }}</span>
      <span class="series-next-title">{{ next.title }}</span>
    </VPLink>
  </aside>
</template>

<style scoped>
.vp-series-next {
  padding: 8px 16px;
  margin-top: 32px;
  background-color: var(--vp-c-bg-soft);
  border: dashed 1px var(--vp-c-divider);
  border-radius: 4px;
}

.series-next-head {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.series-next-head .icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.series-name {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color var(--vp-t-color);
}

a.series-name:hover {
  text-decoration: underline;
}

.series-next-head .divider,
.series-next-head .done {
  color: var(--vp-c-text-3);
}

.series-next-card {
  display: flex;
  gap: 16px;
  align-items: center;
  color: inherit;
  text-decoration: none;
  transition: var(--vp-t-color);
}

a.series-next-card:hover {
  text-decoration: none;
}

.series-next-label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.series-next-title {
  flex: 1 2;
  min-width: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--vp-t-color);
}

a.series-next-card:hover .series-next-title {
  color: var(--vp-c-brand-1);
}

@media print {
  .series-next-head .icon {
    display: none;
  }
}
</style>
