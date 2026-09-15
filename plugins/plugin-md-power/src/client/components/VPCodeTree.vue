<script setup lang="ts">
import { useEventListener, useFullscreen } from '@vueuse/core'
import { computed, onMounted, provide, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { onContentUpdated } from 'vuepress/client'

import '@vuepress/helper/transition/fade-in.css'
import '@vuepress/helper/transition/fade-in-right.css'

const { title, height = '420px', entryFile, showSidebar = false } = defineProps<{
  title?: string
  height?: string
  entryFile?: string
  showSidebar?: boolean
}>()

const activeNode = ref(entryFile || '')
const el = useTemplateRef('el')
const contentEl = useTemplateRef('contentEl')
// Cached list of file content elements with `data-filepath` attributes
const items = shallowRef<NodeListOf<HTMLElement> | null>(null)
// Whether the active file was not found among the content elements
const notFound = ref(false)
// Sidebar visibility state
const show = ref(showSidebar)
// Whether the viewport width is at most 768px (mobile)
const is768 = ref(false)

const { isFullscreen, toggle, isSupported } = useFullscreen(el)

const styles = computed(() => ({
  height: isFullscreen.value ? '100vh' : height,
}))

provide('active-file-tree-node', activeNode)
provide('on-file-tree-node-click', (filepath: string, type: 'file' | 'folder') => {
  if (type === 'file') {
    activeNode.value = filepath
    show.value = false
  }
})

onContentUpdated(() => {
  items.value = contentEl.value?.querySelectorAll('[data-title]') as NodeListOf<HTMLElement>
})

onMounted(() => {
  // Track viewport width to hide fullscreen button on mobile
  is768.value = window.innerWidth <= 768
  useEventListener('resize', () => {
    is768.value = window.innerWidth <= 768
  })

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && show.value)
      show.value = false
  })

  items.value = contentEl.value?.querySelectorAll('[data-title]') as NodeListOf<HTMLElement>
  // Toggle the `active` class on content elements based on the active file
  watch([activeNode, items], () => {
    let hasActive = false
    items.value?.forEach((item) => {
      if (item.dataset.title === activeNode.value) {
        item.classList.add('active')
        hasActive = true
      }
      else {
        item.classList.remove('active')
      }
    })
    notFound.value = !hasActive
  }, { immediate: true })
})
</script>

<template>
  <div ref="el" class="vp-code-tree" :class="{ fullscreen: isFullscreen }">
    <div class="code-tree-actions" :style="styles">
      <button v-if="!isFullscreen" @click="show = !show">
        <span :class="`vpi-sidebar-${show ? 'open' : 'close'}`" />
      </button>
      <button v-if="isSupported && !is768" @click="toggle">
        <span class="vpi-fullscreen" />
      </button>
    </div>
    <Transition name="fade-in-right">
      <div v-show="isFullscreen || show" class="vp-file-tree compact" :style="styles">
        <p v-if="title" class="code-tree-title" :title="title">
          <span>{{ title }}</span>
        </p>
        <div class="file-tree-content">
          <slot name="file-tree" />
        </div>
      </div>
    </Transition>
    <Transition name="fade-in">
      <div
        v-show="show && !isFullscreen" class="code-tree-mask"
        role="button" aria-label="Close"
        tabindex="-1"
        @click="show = false"
      />
    </Transition>
    <div ref="contentEl" class="code-tree-content" :style="styles">
      <slot />
      <div v-show="notFound" class="code-tree-empty">
        <span class="vpi-code-tree-empty" />
      </div>
    </div>
  </div>
</template>

<style>
.vp-code-tree {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block: 16px;
  margin-inline: -24px;
  overflow: hidden;
  background-color: var(--vp-code-block-bg);
  transition: background-color var(--vp-t-color), border-color var(--vp-t-color);
}

@media (min-width: 768px) {
  .vp-code-tree {
    margin-inline: 0;
    border-radius: 6px;
  }
}

.vp-code-tree .code-tree-actions {
  position: relative;
  z-index: 11;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  width: 36px;
  padding-block: 12px;
  background-color: var(--vp-code-block-bg);
  border-right: solid 1px var(--vp-c-divider);
}

.vp-code-tree .code-tree-actions button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: transparent;
  border-radius: 50%;
  transition: background-color 0.25s ease;
}

.vp-code-tree .code-tree-actions button:hover {
  background-color: var(--vp-c-gray-soft);
}

.vp-code-tree .code-tree-actions button [class^="vpi-"] {
  font-size: 1.2em;
}

.vp-code-tree .vp-file-tree {
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: calc(100% / 3);
  min-width: 200px;
  max-width: calc(100% - 36px);
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 0;
}

.vp-code-tree.fullscreen .vp-file-tree {
  max-width: 360px;
  border-right: solid 1px var(--vp-c-divider);
}

.vp-code-tree .code-tree-mask,
.vp-code-tree:not(.fullscreen) .vp-file-tree {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 36px;
}

.vp-code-tree .code-tree-mask {
  right: 0;
  z-index: 9;
  background-color: rgb(0 0 0 / 0.5);
}

.vp-code-tree .code-tree-title {
  height: 40px;
  padding: 0 16px;
  margin: 0;
  overflow: hidden;
  font-weight: 500;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: solid 1px var(--vp-c-divider);
}

.vp-code-tree .vp-file-tree .vp-file-tree-info.file {
  cursor: pointer;
}

.vp-code-tree .vp-file-tree .file-tree-content {
  flex: 1 2;
  min-height: 0;
  padding: 16px;
  overflow: auto;

  scrollbar-width: thin;
}

.vp-code-tree .code-tree-content {
  position: relative;
  flex: 1 2;
  min-width: 0;
}

.vp-code-tree div[class*="language-"] {
  flex: 1 2;
  margin: 16px 0 0;
  overflow: auto;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

@media (min-width: 768px) {
  .vp-code-tree .vp-file-tree,
  .vp-code-tree div[class*="language-"] {
    overscroll-behavior: contain;
  }
}

.vp-code-tree .code-block-title {
  height: 100%;
}

.vp-code-tree .code-block-title .code-block-title-bar {
  margin-top: 0;
  border-radius: 0;
}

.vp-code-tree div[class*="language-"].has-collapsed-lines.collapsed {
  height: auto;
  overflow: auto;
}

.vp-code-tree div[class*="language-"].has-collapsed-lines .collapsed-lines {
  display: none;
}

.vp-code-tree .code-tree-content img {
  position: relative;
  top: 50%;
  left: 50%;
  max-width: calc(100% - 40px);
  max-height: calc(100% - 32px);
  margin: 0;
  object-fit: contain;
  transform: translate(-50%, -50%);
}

.vp-code-tree .code-tree-content [data-title] {
  display: none;
}

.vp-code-tree .code-tree-content [data-title]:not(img).active {
  display: flex;
}

.vp-code-tree .code-block-title.active {
  display: flex;
  flex-direction: column;
}

.vp-code-tree .code-tree-content img[data-title].active {
  display: block;
}

.vp-code-tree .code-tree-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.vp-code-tree .code-tree-empty .vpi-code-tree-empty {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m198.24 62.63l15.68-17.25a8 8 0 0 0-11.84-10.76L186.4 51.86A95.95 95.95 0 0 0 57.76 193.37l-15.68 17.25a8 8 0 1 0 11.84 10.76l15.68-17.24A95.95 95.95 0 0 0 198.24 62.63M48 128a80 80 0 0 1 127.6-64.25l-107 117.73A79.63 79.63 0 0 1 48 128m80 80a79.55 79.55 0 0 1-47.6-15.75l107-117.73A79.95 79.95 0 0 1 128 208'/%3E%3C/svg%3E");

  width: 128px;
  height: 128px;
  color: var(--vp-c-default-soft);
}

.vp-code-tree .vpi-fullscreen {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2'/%3E%3Crect width='10' height='8' x='7' y='8' rx='1'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
