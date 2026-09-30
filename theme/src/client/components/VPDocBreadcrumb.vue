<script setup lang="ts">
import VPLink from '@theme/VPLink.vue'
import { useBreadcrumb } from '../composables/index.js'

const { hasBreadcrumb, breadcrumbList } = useBreadcrumb()
</script>

<template>
  <nav
    v-if="hasBreadcrumb"
    class="vp-breadcrumb"
  >
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li
        v-for="({ text, link, current }, index) in breadcrumbList"
        :key="link"
        property="itemListElement"
        typeof="ListItem"
      >
        <VPLink :href="link" class="breadcrumb" :class="{ current }" property="item" typeof="WebPage" :text="text" no-icon />
        <span v-if="index !== breadcrumbList.length - 1" class="vpi-chevron-right" />
        <meta property="name" :content="text">
        <meta property="position" :content="`${index + 1}`">
      </li>
    </ol>
  </nav>
</template>

<style>
.vp-breadcrumb {
  padding-left: 8px;
  margin-bottom: 2rem;
  border-left: solid 2px var(--vp-c-brand-1);
  transition: border-left var(--vp-t-color);
}

@media print {
  .vp-breadcrumb {
    display: none;
  }
}

.vp-breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 400;
}

.vp-breadcrumb ol li {
  display: flex;
  align-items: center;
}

.vp-breadcrumb .breadcrumb {
  font-weight: bold;
  color: var(--vp-c-brand-2);
  transition: color var(--vp-t-color);
}

.vp-breadcrumb .breadcrumb:hover {
  color: var(--vp-c-brand-1);
}

.vp-breadcrumb .breadcrumb.current {
  color: var(--vp-c-text-3);
}

.vp-breadcrumb .vpi-chevron-right {
  margin-left: 4px;
  color: var(--vp-c-border);
  transition: color var(--vp-t-color);
}
</style>
