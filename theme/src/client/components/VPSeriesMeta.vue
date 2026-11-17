<script setup lang="ts">
import VPLink from '@theme/VPLink.vue'
import { useSeries } from '../composables/index.js'

const { enabled, series, name, chapterText, includedLabel, navLabel } = useSeries()
</script>

<template>
  <p v-if="enabled" class="vp-series-meta">
    <span class="vpi-series icon" aria-hidden="true" />
    <span class="label">{{ includedLabel }}</span>
    <VPLink
      v-if="series?.link"
      class="name"
      :href="series.link"
      :aria-label="`${series.title} — ${navLabel}`"
    >
      {{ name }}
    </VPLink>
    <span v-else class="name">{{ name }}</span>
    <span class="divider" aria-hidden="true">·</span>
    <span class="chapter">{{ chapterText }}</span>
  </p>
</template>

<style scoped>
.vp-series-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: dashed 1px var(--vp-c-divider);
  border-radius: 4px;
  transition: color var(--vp-t-color);
}

.vp-series-meta .icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.vp-series-meta .name {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color var(--vp-t-color);
}

a.name:hover {
  text-decoration: underline;
}

.vp-series-meta .divider {
  color: var(--vp-c-text-3);
}

.vp-series-meta .chapter {
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
}

@media print {
  .vp-series-meta .icon {
    display: none;
  }
}
</style>
