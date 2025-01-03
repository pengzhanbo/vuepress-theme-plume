<script setup lang="ts">
import VPDocHeader from '@theme/VPDocHeader.vue'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { usePageLang } from 'vuepress/client'
import { useData, useLastUpdated, useThemeData } from '../composables/index.js'

const { theme, frontmatter, page } = useData()
const themeData = useThemeData()
const lang = usePageLang()
const { datetime, lastUpdatedText } = useLastUpdated()

const list = computed(() => {
  const list = page.value.git?.changelog || []
  const formatter = new Intl.DateTimeFormat(lang.value, { dateStyle: 'short' })
  return list.map(({ date, ...item }) => {
    const datetime = formatter.format(date)
    return { datetime, ...item }
  })
})

const hasChangelog = computed(() =>
  list.value.length && (frontmatter.value.changelog ?? !!themeData.value.changelog),
)
</script>

<template>
  <div v-if="hasChangelog" class="vp-doc-changelog">
    <VPDocHeader anchor="doc-changelog">
      {{ theme.changelogText || 'Changelog' }}
    </VPDocHeader>

    <details class="hint-container details">
      <summary class="changelog-header">
        <span><span class="vpi-changelog" /><span>{{ lastUpdatedText }}:</span> <span>{{ datetime }}</span></span>
        <span class="changelog-button"><span class="vpi-menu" /><span>{{ theme.changelogButtonText || 'View All Changelog' }}</span></span>
      </summary>

      <ul class="changelog-list">
        <template v-for="item in list" :key="item.hash">
          <li v-if="item.tag" class="changelog release-tag">
            <div>
              <VPLink :href="item.tagUrl" no-icon class="release-tag">
                <code>{{ item.tag }}</code>
              </VPLink>
              <span class="datetime" data-allow-mismatch>{{ theme.changelogOnText }} {{ item.datetime }}</span>
            </div>
          </li>
          <li v-else class="changelog commit">
            <div>
              <VPLink :href="item.commitUrl" no-icon class="hash">
                <code>{{ item.hash.slice(0, 5) }}</code>
              </VPLink>
              <span class="divider">-</span>
            </div>
            <div>
              <p class="message" v-html="item.message" />
              <span class="datetime" data-allow-mismatch>{{ theme.changelogOnText }} {{ item.datetime }}</span>
            </div>
          </li>
        </template>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.vp-doc-changelog .changelog-header {
  display: block;
}

@media print {
  .vp-doc-changelog {
    display: none;
  }
}

.vp-doc-changelog .changelog-header > span {
  display: block;
}

@media (min-width: 440px) {
  .vp-doc-changelog .changelog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.vp-doc-changelog .changelog-header [class*="vpi-"] {
  margin-right: 4px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
  transform: translateY(-1px);
}

.vp-doc-changelog .changelog-header .changelog-button:hover,
.vp-doc-changelog .changelog-header .changelog-button:hover .vpi-menu {
  color: var(--vp-c-brand-1);
  transition: color var(--vp-t-color);
}

.vp-doc-changelog .changelog-list {
  padding-left: 0;
  list-style: none;
}

.vp-doc-changelog .changelog-list .changelog {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-left: 20px;
  transition: color var(--vp-t-color);
}

.vp-doc-changelog .changelog-list .changelog::before {
  position: absolute;
  top: 4px;
  left: 0;
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  color: var(--vp-c-text-3);
  content: "";
  background-color: currentcolor;
  -webkit-mask: var(--icon) no-repeat;
  mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  transition: color var(--vp-t-color);
}

.vp-doc-changelog .changelog-list .changelog.commit::before {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m3-9v6m0 6v6'/%3E%3C/svg%3E");
}

.vp-doc-changelog .changelog-list .changelog.release-tag::before {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0'/%3E%3Cpath d='M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592-5.592a2.41 2.41 0 0 0 0-3.408l-7.71-7.71A2 2 0 0 0 11.172 3H6a3 3 0 0 0-3 3'/%3E%3C/g%3E%3C/svg%3E");
}

.vp-doc-changelog .changelog-list .changelog .release-tag {
  margin-right: 4px;
  text-decoration: none;
}

.vp-doc-changelog .changelog-list .changelog .release-tag code {
  font-size: 14px;
  font-weight: 500;
}

.vp-doc-changelog .changelog-list .changelog .hash {
  margin-right: 4px;
  text-decoration: none;
}

.vp-doc-changelog .changelog-list .changelog .divider {
  margin-right: 8px;
}

.vp-doc-changelog .changelog-list .changelog .message {
  display: inline;
  margin-right: 8px;
}

.vp-doc-changelog .changelog-list .changelog .message :deep(a::after) {
  display: none;
}

.vp-doc-changelog .changelog-list .changelog .datetime {
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}
</style>
