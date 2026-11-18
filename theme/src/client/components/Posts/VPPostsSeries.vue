<script setup lang="ts">
import VPLink from '@theme/VPLink.vue'
import { getReadingTimeLocale, useReadingTimeLocaleConfig } from '@vuepress/plugin-reading-time/client'
import { computed } from 'vue'
import { useRoute } from 'vuepress/client'
import { useData, useSeriesPage } from '../../composables/index.js'

const { theme } = useData()
const route = useRoute()
const series = useSeriesPage()
const readingTimeConfig = useReadingTimeLocaleConfig()

const chapters = computed(() => series.value?.chapters ?? [])

const totalText = computed(() =>
  (theme.value.seriesTotalText || '{count} chapters').replace('{count}', String(chapters.value.length)),
)

/**
 * Total minutes are only shown when every chapter has a reading time, otherwise the
 * total would be a half truth.
 *
 * 仅在全部章节都有阅读时长时展示总时长，避免给出半个总数。
 */
const totalMinutes = computed(() => {
  const list = chapters.value
  if (!list.length || list.some(item => !item.readingTime))
    return 0
  return list.reduce((total, item) => total + (item.readingTime ?? 0), 0)
})

const totalTimeText = computed(() => formatTime(totalMinutes.value))

const feedText = computed(() => theme.value.seriesFeedText || 'Subscribe')

function formatTime(minutes?: number): string {
  const locale = readingTimeConfig.value
  if (!minutes || !locale)
    return ''
  // 去掉语言预设里的修饰前缀（如「大约」「about」），与文章列表保持一致
  return getReadingTimeLocale({ minutes, words: 0 }, locale).time.replace(/^\D+/, '')
}

function shortDate(value: string): string {
  return value.split(/\s|T/)[0].replace(/\//g, '-')
}
</script>

<template>
  <div v-if="series" class="vp-series">
    <header class="series-header">
      <h1 class="series-title">
        <span class="vpi-series icon" aria-hidden="true" />
        <span>{{ series.title }}</span>
      </h1>

      <p v-if="series.description" class="series-desc">
        {{ series.description }}
      </p>

      <div class="series-meta">
        <div class="meta">
          <span class="vpi-post icon" aria-hidden="true" />
          <span>{{ totalText }}</span>
        </div>
        <div v-if="totalTimeText" class="meta">
          <span class="vpi-books icon" aria-hidden="true" />
          <span>{{ totalTimeText }}</span>
        </div>
        <a
          v-if="series.feedUrl"
          class="feed-link"
          :href="series.feedUrl"
          target="_blank"
          rel="noopener noreferrer"
          :title="feedText"
        >
          <span class="vpi-rss icon" aria-hidden="true" />
          <span>{{ feedText }}</span>
        </a>
      </div>

      <div v-if="series.cover" class="series-cover">
        <img :src="series.cover" :alt="series.title" loading="lazy">
      </div>
    </header>

    <ol class="series-chapters">
      <li
        v-for="item in chapters"
        :key="item.path"
        class="chapter"
        :class="{ current: item.path === route.path, draft: item.draft }"
        :aria-current="item.path === route.path ? 'page' : undefined"
      >
        <span class="index" aria-hidden="true">{{ item.order }}</span>

        <div class="chapter-content">
          <VPLink class="chapter-title" :href="item.path">
            {{ item.title }}
          </VPLink>

          <div class="chapter-meta">
            <span v-if="item.draft" class="badge">{{ theme.seriesDraftText || 'Draft' }}</span>
            <div v-if="item.createTime" class="meta">
              <span class="vpi-clock icon" aria-hidden="true" />
              <time :datetime="shortDate(item.createTime)">{{ shortDate(item.createTime) }}</time>
            </div>
            <div v-if="item.readingTime" class="meta">
              <span class="vpi-books icon" aria-hidden="true" />
              <span>{{ formatTime(item.readingTime) }}</span>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.vp-series {
  flex: 1 2;
  min-width: 0;
}

/* ---------- header ---------- */

.series-header {
  padding: 20px 16px;
  margin: 0 -16px 24px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.series-title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--vp-c-brand-1);
  transition: color var(--vp-t-color);
}

.series-title .icon {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
}

.series-desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.series-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0 16px;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.feed-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color var(--vp-t-color);
}

.feed-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.feed-link:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.feed-link .icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.series-cover {
  margin-top: 16px;
  overflow: hidden;
  border-radius: 8px;
}

.series-cover img {
  display: block;
  width: 100%;
  max-height: 200px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* ---------- shared meta row ---------- */

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

/* ---------- chapters ---------- */

.series-chapters {
  padding: 8px 0;
  margin: 0 -16px;
  list-style: none;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.chapter {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 16px;
  margin: 0;
  border-radius: 6px;
  transition: background-color var(--vp-t-color);
}

.chapter:hover {
  background-color: var(--vp-c-bg-alt);
}

.chapter.current {
  background-color: var(--vp-c-brand-soft);
}

.index {
  flex-shrink: 0;
  min-width: 26px;
  padding: 2px 6px;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
  color: var(--vp-c-text-3);
  text-align: center;
  background-color: var(--vp-c-bg-alt);
  border-radius: 4px;
  transition: var(--vp-t-color);
  transition-property: color, background-color;
}

.chapter:hover .index,
.chapter.current .index {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.chapter-content {
  display: flex;
  flex: 1 2;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.chapter-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  text-decoration: none;
  overflow-wrap: break-word;
  transition: color var(--vp-t-color);
}

.chapter:focus-within {
  background-color: var(--vp-c-bg-alt);
}

.chapter-title:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.chapter:hover .chapter-title,
.chapter.current .chapter-title {
  color: var(--vp-c-brand-1);
}

.chapter-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  align-items: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.badge {
  display: inline-block;
  padding: 3px 6px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
  border-radius: 4px;
  transition: var(--vp-t-color);
  transition-property: color, background-color;
}

/* ---------- desktop ---------- */

@media (min-width: 768px) {
  .series-header,
  .series-chapters {
    margin-right: 0;
    margin-left: 0;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: box-shadow, background-color;
  }

  .series-header {
    padding: 20px 24px;
    margin-bottom: 24px;
  }

  .series-chapters {
    padding: 8px;
    margin-bottom: 24px;
  }

  .series-header:hover,
  .series-chapters:hover {
    box-shadow: var(--vp-shadow-2);
  }

  .chapter {
    padding: 10px 16px;
  }
}

@media (min-width: 1200px) {
  .vp-series {
    margin-left: 0;
  }
}

/* ---------- print ---------- */

@media print {
  .series-header,
  .series-chapters {
    box-shadow: none;
  }

  .series-title .icon,
  .meta .icon {
    display: none;
  }
}
</style>
