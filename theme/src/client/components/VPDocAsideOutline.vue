<script lang="ts" setup>
import VPDocOutlineItem from '@theme/VPDocOutlineItem.vue'
import { computed, ref } from 'vue'
import { useActiveAnchor, useData, useHeaders } from '../composables/index.js'

const { theme } = useData()

const headers = useHeaders()
const hasOutline = computed(() => headers.value.length > 0)

const container = ref()
const marker = ref()

useActiveAnchor(container, marker)

function handlePrint() {
  window.print()
}
</script>

<template>
  <nav
    ref="container"
    aria-labelledby="doc-outline-aria-label"
    class="vp-doc-aside-outline"
    :class="{ 'has-outline': hasOutline }"
    role="navigation"
  >
    <div class="content">
      <div ref="marker" class="outline-marker" />

      <div
        id="doc-outline-aria-label"
        aria-level="2"
        class="outline-title"
        role="heading"
      >
        <span>{{ theme.outlineLabel || 'On this page' }}</span>
        <span class="vpi-print icon" @click="handlePrint" />
      </div>

      <VPDocOutlineItem :headers="headers" :root="true" />
    </div>
  </nav>
</template>

<style scoped>
.vp-doc-aside-outline {
  display: none;
}

.vp-doc-aside-outline.has-outline {
  display: block;
}

.content {
  position: relative;
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
  border-left: 1px solid var(--vp-c-divider);
  transition: border-left var(--vp-t-color);
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
    background-color var(--vp-t-color),
    opacity var(--vp-t-color);
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
