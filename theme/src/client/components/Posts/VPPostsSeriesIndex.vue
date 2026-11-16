<script setup lang="ts">
import type { ThemeSeries } from '../../../shared/index.js'
import VPLink from '@theme/VPLink.vue'
import { getReadingTimeLocale, useReadingTimeLocaleConfig } from '@vuepress/plugin-reading-time/client'
import { useData, useSeriesList } from '../../composables/index.js'

/**
 * Chapters previewed inside a series card. The full list lives on the landing page.
 *
 * 卡片内展示的章节预览数，完整列表在系列落地页中。
 */
const PREVIEW_LIMIT = 3

const { theme } = useData()
const seriesList = useSeriesList()
const readingTimeConfig = useReadingTimeLocaleConfig()

function chapterCountText(item: ThemeSeries): string {
  return (theme.value.seriesTotalText || '{count} chapters')
    .replace('{count}', String(item.chapters.length))
}

/**
 * Total minutes are only shown when every chapter has a reading time, otherwise the
 * total would be a half truth.
 *
 * 仅在全部章节都有阅读时长时展示总时长，避免给出半个总数。
 */
function minutesText(item: ThemeSeries): string {
  const locale = readingTimeConfig.value

  if (!locale || !item.chapters.length || item.chapters.some(chapter => !chapter.readingTime))
    return ''

  const minutes = item.chapters.reduce((total, chapter) => total + (chapter.readingTime ?? 0), 0)

  return getReadingTimeLocale({ minutes, words: 0 }, locale).time.replace(/^\D+/, '')
}
</script>

<template>
  <div v-if="seriesList.length" class="vp-series-index">
    <h1 class="series-index-title">
      <span class="vpi-series icon" aria-hidden="true" />
      <span>{{ theme.seriesIndexText || 'All Series' }}</span>
    </h1>

    <ul class="series-list">
      <li v-for="item in seriesList" :key="item.id" class="series-item" :class="{ 'has-cover': item.cover }">
        <div v-if="item.cover" class="series-cover">
          <img :src="item.cover" :alt="item.title" loading="lazy">
        </div>

        <h2 class="series-item-title">
          <VPLink
            v-if="item.link"
            class="series-name"
            :href="item.link"
            :aria-label="`${item.title} — ${chapterCountText(item)}`"
          >
            {{ item.title }}
          </VPLink>
          <template v-else>
            {{ item.title }}
          </template>
          <span v-if="item.link" class="vpi-chevron-right chevron" aria-hidden="true" />
        </h2>

        <p v-if="item.description" class="series-item-desc">
          {{ item.description }}
        </p>

        <div class="series-item-meta">
          <div class="meta">
            <span class="vpi-post icon" aria-hidden="true" />
            <span>{{ chapterCountText(item) }}</span>
          </div>
          <div v-if="minutesText(item)" class="meta">
            <span class="vpi-books icon" aria-hidden="true" />
            <span>{{ minutesText(item) }}</span>
          </div>
        </div>

        <ol class="series-preview">
          <li v-for="chapter in item.chapters.slice(0, PREVIEW_LIMIT)" :key="chapter.path" class="chapter">
            <span class="index" aria-hidden="true">{{ chapter.order }}</span>
            <VPLink class="chapter-title" :href="chapter.path">
              {{ chapter.title }}
            </VPLink>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.vp-series-index {
  flex: 1 2;
  min-width: 0;
  padding-bottom: 24px;
}

/* ---------- page title ---------- */

.series-index-title {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 16px;
  margin: 0 -16px 24px;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color), color var(--vp-t-color);
}

.series-index-title .icon {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
}

/* ---------- cards ---------- */

.series-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.series-item {
  padding: 20px 16px;
  margin: 0 -16px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.series-item-title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.series-name {
  color: inherit;
  text-decoration: none;
  overflow-wrap: break-word;
  transition: color var(--vp-t-color);
}

.series-item-title a:hover,
.series-item-title a:focus-visible {
  color: var(--vp-c-brand-1);
}

.series-item-title a:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.chevron {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  margin-left: auto;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color), transform var(--vp-t-color);
}

.series-item:hover .chevron {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

.series-cover {
  margin: -20px -16px 16px;
  overflow: hidden;
}

.series-cover img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 7;
  object-fit: cover;
}

.series-item-desc {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.series-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0 16px;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.meta {
  display: flex;
  gap: 6px;
  align-items: center;
  font-variant-numeric: tabular-nums;
}

.meta .icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

/* ---------- preview ---------- */

.series-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0 0;
  margin: 12px 0 0;
  list-style: none;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-top var(--vp-t-color);
}

.series-preview .chapter {
  display: flex;
  gap: 10px;
  align-items: baseline;
  margin: 0;
}

.series-preview .index {
  flex-shrink: 0;
  min-width: 1.5em;
  font-size: 13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
  text-align: right;
  transition: color var(--vp-t-color);
}

.series-preview .chapter-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  overflow-wrap: break-word;
  transition: color var(--vp-t-color);
}

.series-preview .chapter-title:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.series-preview .chapter:hover .chapter-title,
.series-preview .chapter:hover .index {
  color: var(--vp-c-brand-1);
}

/* ---------- desktop ---------- */

@media (min-width: 768px) {
  .series-index-title {
    padding: 20px 24px;
    margin-right: 0;
    margin-left: 0;
    font-size: 24px;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: box-shadow, background-color, color;
  }

  .series-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 24px;
  }

  .series-item {
    padding: 20px 24px;
    margin: 0;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: box-shadow, background-color, color;
  }

  .series-cover {
    margin: -20px -24px 16px;
    border-radius: 8px 8px 0 0;
  }

  .series-item:hover {
    box-shadow: var(--vp-shadow-2);
  }
}

@media (min-width: 1200px) {
  .vp-series-index {
    margin-left: 0;
  }
}

/* ---------- print ---------- */

@media print {
  .series-item {
    box-shadow: none;
  }

  .series-index-title .icon,
  .meta .icon,
  .chevron {
    display: none;
  }
}
</style>
