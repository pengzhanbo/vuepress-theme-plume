<script lang="ts" setup>
import { computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import { useSidebar } from '../composables/index.js'
import { useThemeLocaleData } from '../composables/themeData.js'
import type { PlumeThemePageFrontmatter } from '../../shared/index.js'

const props = defineProps<{
  isNotFound?: boolean
}>()

const { hasSidebar } = useSidebar()

const theme = useThemeLocaleData()
const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()
const enabledExternalIcon = computed(() => {
  return frontmatter.value.externalLink ?? theme.value.externalLinkIcon ?? true
})
</script>

<template>
  <div
    id="LayoutContent" class="layout-content" :class="{
      'has-sidebar': hasSidebar && !props.isNotFound,
      'external-link-icon-enabled': enabledExternalIcon,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.layout-content {
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  padding-left: 0;
  margin: var(--vp-layout-top-height, 0) auto 0;
  transition: padding-left 0.2s ease;
}

.layout-content.is-home {
  width: 100%;
  max-width: 100%;
}

.layout-content.has-sidebar {
  margin: 0;
}

@media (min-width: 960px) {
  .layout-content {
    padding-top: var(--vp-nav-height);
  }

  .layout-content.has-sidebar {
    padding-left: var(--vp-sidebar-width);
    margin: var(--vp-layout-top-height, 0) 0 0;
  }
}

@media (min-width: 1440px) {
  .layout-content.has-sidebar {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left:
      calc(
        (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width)
      );
  }
}
</style>
