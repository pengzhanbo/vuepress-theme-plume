<script setup lang="ts">
import { computed } from 'vue'
import { VPLink } from 'vuepress-theme-plume/client'
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
      <span class="vpi-github-star" />
      <span class="link-text">{{ locale.star }}</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" no-icon href="https://github.com/pengzhanbo/vuepress-theme-plume/issues/new/choose">
      <span class="vpi-github-issue" />
      <span class="link-text">{{ locale.issue }}</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" href="/sponsor/">
      <span class="vpi-bubble-tea" />
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

.vpi-github-star {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m12 1.5l3.1 6.3l6.9 1l-5 4.8l1.2 6.9l-6.2-3.2l-6.2 3.2L7 13.6L2 8.8l6.9-1z'/%3E%3C/svg%3E");
}

.vpi-github-issue {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M8 9.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3'/%3E%3Cpath fill='%23000' d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M1.5 8a6.5 6.5 0 1 0 13 0a6.5 6.5 0 0 0-13 0'/%3E%3C/svg%3E");
}

.vpi-bubble-tea {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m17.95 9l-1.478 8.69c-.25 1.463-.374 2.195-.936 2.631c-1.2.931-6.039.88-7.172 0c-.562-.436-.687-1.168-.936-2.632L5.95 9M6 9l.514-1.286a5.908 5.908 0 0 1 10.972 0L18 9M5 9h14m-7 0l4-7m-5.99 12h.01m1 4h.01m1.99-2h.01'/%3E%3C/svg%3E");
}
</style>
