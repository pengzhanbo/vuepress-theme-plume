<script setup lang="ts">
import type { SearchBoxLocales, SearchOptions } from '../../shared/index.js'
import { onKeyStroke } from '@vueuse/core'
import {
  computed,
  defineAsyncComponent,
  ref,
  toRef,
} from 'vue'
import { useLocale } from '../composables/index.js'
import SearchButton from './SearchButton.vue'

const props = defineProps<{
  locales: SearchBoxLocales
  options: SearchOptions
}>()

const SearchBox = defineAsyncComponent(() => import('./SearchBox.vue'))

const showSearch = ref(false)

const locale = useLocale(toRef(() => props.locales))

/**
 * Text shown when JavaScript is disabled.
 *
 * 禁用 JavaScript 时展示的提示文本。
 *
 * `<noscript>` 仅在脚本被禁用时渲染，且必须是纯文本：启用脚本时浏览器会把
 * 其中的内容当作原始文本，若包含元素或 HTML 实体会造成水合不匹配。
 * `<noscript>` only renders with scripting disabled, and must stay plain text:
 * with scripting enabled browsers parse its content as raw text, so elements or
 * HTML entities would cause a hydration mismatch.
 */
const noscriptText = computed(
  () => locale.value.noscriptText || 'Search is unavailable without JavaScript.',
)

onKeyStroke('k', (event) => {
  // 在输入框 / 可编辑区域内不劫持 Ctrl/Cmd + K（如 macOS 的删除至行尾）。
  // Do not hijack Ctrl/Cmd + K while editing content (e.g. macOS delete-to-end-of-line).
  if ((event.ctrlKey || event.metaKey) && !isEditingContent(event)) {
    event.preventDefault()
    showSearch.value = true
  }
})

onKeyStroke('/', (event) => {
  // 仅在无修饰键且不在编辑内容时劫持，避免与浏览器/系统组合键冲突。
  // Only hijack without modifiers and outside editable content to avoid clashing
  // with browser/system shortcuts.
  if (
    !event.ctrlKey
    && !event.metaKey
    && !event.altKey
    && !isEditingContent(event)
  ) {
    event.preventDefault()
    showSearch.value = true
  }
})

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  const tagName = element.tagName

  return (
    element.isContentEditable
    || tagName === 'INPUT'
    || tagName === 'SELECT'
    || tagName === 'TEXTAREA'
  )
}
</script>

<template>
  <div class="search-wrapper">
    <SearchBox
      v-if="showSearch"
      :locales="locales"
      :options="options"
      @close="showSearch = false"
    />

    <div id="local-search">
      <SearchButton :locales="locales" @click="showSearch = true" />
    </div>

    <noscript>{{ noscriptText }}</noscript>
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
}

/* 仅在禁用 JavaScript 时可见的降级提示。
   Fallback hint that is only visible when JavaScript is disabled. */
.search-wrapper noscript {
  font-size: 13px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

@media (min-width: 768px) {
  .search-wrapper {
    flex-grow: 1;
  }
}
</style>
