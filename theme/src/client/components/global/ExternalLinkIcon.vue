<script lang="ts" setup>
import { usePageFrontmatter } from 'vuepress/client'
import { computed } from 'vue'
import IconExternalLink from '../icons/IconExternalLink.vue'
import type { PlumeThemePageFrontmatter } from '../../../shared/index.js'

const matter = usePageFrontmatter<PlumeThemePageFrontmatter>()
const show = computed(() => matter.value.externalLink !== false)
</script>

<template>
  <IconExternalLink v-if="show" class="external-icon" />
</template>

<style scoped>
.external-icon {
  position: relative;
  top: 1px;
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  color: var(--vp-c-text-3);
  vertical-align: middle;
  transition: color var(--t-color);
}

@media print {
  .external-icon {
    display: none;
  }
}
</style>
