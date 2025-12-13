<script setup lang="ts">
import { computed } from 'vue'
import { VPIcon, VPLink } from 'vuepress-theme-plume/client'
import { useRouteLocale } from 'vuepress/client'

interface Locale {
  star: string
  issue: string
  sponsor: string
}

const locales: Record<string, Locale> = {
  '/': { star: '在 GitHub 上 Star', issue: '遇到问题？', sponsor: '喝杯奶茶' },
  '/en/': { star: 'Star on GitHub', issue: 'Create Issues', sponsor: 'Buy me a Bubble Tea' },
}

const lang = useRouteLocale()
const locale = computed(() => locales[lang.value])
</script>

<template>
  <div class="aside-nav-wrapper">
    <VPLink class="link" no-icon href="https://github.com/pengzhanbo/vuepress-theme-plume">
      <VPIcon name="tabler:star" />
      <span class="link-text">{{ locale.star }}</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" no-icon href="https://github.com/pengzhanbo/vuepress-theme-plume/issues/new/choose">
      <VPIcon name="octicon:issue-opened-16" />
      <span class="link-text">{{ locale.issue }}</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" href="/sponsor/">
      <VPIcon name="ep:milk-tea" />
      <span class="link-text">{{ locale.sponsor }}</span>
      <span class="vpi-arrow-right" />
    </VPLink>
  </div>
</template>

<style scoped>
.aside-nav-wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  margin: 16px 16px 0;
  border-top: solid 1px var(--vp-c-divider);
}

.aside-nav-wrapper .link {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.aside-nav-wrapper .link:hover {
  color: var(--vp-c-brand-1);
}

.aside-nav-wrapper .link .link-text {
  flex: 1 2;
  font-size: 12px;
}

.aside-nav-wrapper :deep([class*=" vpi-"]) {
  margin: 0;
}
</style>
