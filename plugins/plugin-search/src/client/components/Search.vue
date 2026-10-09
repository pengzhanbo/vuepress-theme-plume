<script setup lang="ts">
import type { SearchBoxLocales, SearchOptions } from '../../shared/index.js'
import { onKeyStroke } from '@vueuse/core'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  toRef,
  useTemplateRef,
} from 'vue'
import { useLocale } from '../composables/index.js'
import SearchButton from './SearchButton.vue'

const props = defineProps<{
  locales: SearchBoxLocales
  options: SearchOptions
}>()

const SearchBox = defineAsyncComponent(() => import('./SearchBox.vue'))

const showSearch = ref(false)

const searchButtonRef = useTemplateRef<{ focus: () => void }>('searchButton')

const locale = useLocale(toRef(() => props.locales))

/**
 * Close the search box and hand focus back to the trigger button.
 *
 * 关闭搜索框，并把焦点归还给触发按钮。
 *
 * The search box unmounts its own focus trap, so without this the focused input
 * disappears and focus falls back to `<body>`, forcing keyboard users to tab
 * through the whole page again.
 *
 * 搜索框卸载时会一并销毁自身的焦点陷阱：若不显式归还，被聚焦的输入框随组件
 * 消失后焦点会落到 `<body>`，键盘用户只能从页面第一个元素重新 Tab 一遍。
 *
 * Opening a search result is the exception: the page changes, so focus is left
 * alone instead of being pulled back into the navbar.
 *
 * 打开搜索结果属于例外：页面已经切换，此时不应把焦点抢回导航栏。
 */
function closeSearch(options?: { restoreFocus?: boolean }) {
  showSearch.value = false

  if (options?.restoreFocus === false)
    return

  // 等待卸载完成（焦点陷阱销毁）后再归还焦点，否则会被其收尾逻辑覆盖。
  // Wait until the unmount finished (the focus trap is destroyed), otherwise the
  // trap teardown would override the focus we just set.
  nextTick(() => searchButtonRef.value?.focus())
}

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
      @close="closeSearch"
    />

    <div id="local-search">
      <SearchButton ref="searchButton" :locales="locales" @click="showSearch = true" />
    </div>

    <noscript>{{ noscriptText }}</noscript>
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
}

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
