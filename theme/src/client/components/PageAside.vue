<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onContentUpdated } from '@vuepress-plume/plugin-content-update/client'
import { type MenuItem, getHeaders, useActiveAnchor, useData } from '../composables/index.js'
import PageAsideItem from './PageAsideItem.vue'

const { theme, frontmatter } = useData()

const headers = ref<MenuItem[]>([])
const hasOutline = computed(() => headers.value.length > 0)

onContentUpdated(() => {
  headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline)
})

const container = ref()
const marker = ref()

useActiveAnchor(container, marker)

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="page-aside">
    <div
      ref="container"
      class="page-aside-outline"
      :class="{ 'has-outline': hasOutline }"
    >
      <div class="content">
        <div ref="marker" class="outline-marker" />

        <div class="outline-title">
          <span>{{ theme.outlineLabel || 'On this page' }}</span>
          <span class="vpi-print icon" @click="handlePrint" />
        </div>

        <nav aria-labelledby="doc-outline-aria-label">
          <span id="doc-outline-aria-label" class="visually-hidden">
            Table of Contents for current page
          </span>
          <PageAsideItem
            :headers="headers"
            :root="true"
          />
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-aside {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.page-aside-outline {
  display: none;
}

.page-aside-outline.has-outline {
  display: block;
}

.content {
  position: relative;
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
  border-left: 1px solid var(--vp-c-divider);
  transition: border-left var(--t-color);
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  width: 2px;
  height: 18px;
  background-color: var(--vp-c-brand-1);
  border-radius: 2px;
  opacity: 0;
  transition:
    top 0.25s cubic-bezier(0, 1, 0.5, 1),
    background-color var(--t-color),
    opacity var(--t-color);
}

.outline-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.4px;
}

.outline-title .icon {
  margin-left: 4px;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
