<script lang="ts" setup>
import { usePageData } from '@vuepress/client'
import { computed, ref } from 'vue'
import { useActiveAnchor, useThemeLocaleData } from '../composables/index.js'
import IconPrint from './icons/IconPrint.vue'
import PageAsideItem from './PageAsideItem.vue'

const page = usePageData()
const theme = useThemeLocaleData()

const headers = computed(() => page.value.headers)
const hasOutline = computed(() => headers.value.length > 0)

const container = ref()
const marker = ref()

useActiveAnchor(container, marker)

function handleClick({ target: el }: Event) {
  const id = `#${(el as HTMLAnchorElement).href!.split('#')[1]}`
  const heading = document.querySelector<HTMLAnchorElement>(
    decodeURIComponent(id),
  )
  heading?.focus()
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
          <IconPrint class="icon" />
        </div>

        <nav aria-labelledby="doc-outline-aria-label">
          <span id="doc-outline-aria-label" class="visually-hidden">
            Table of Contents for current page
          </span>
          <PageAsideItem
            :headers="headers"
            :root="true"
            :on-click="handleClick"
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
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 1px;
  height: 18px;
  background-color: var(--vp-c-brand-1);
  transition: top 0.25s cubic-bezier(0, 1, 0.5, 1), background-color 0.5s,
    opacity 0.25s;
}

.outline-title {
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  line-height: 28px;
  font-size: 13px;
  font-weight: 600;
}
.outline-title .icon {
  margin-left: 4px;
  width: 1em;
  height: 1em;
  font-size: 1.2em;
}
</style>
