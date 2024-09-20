<script setup lang="ts">
import type { SearchBoxLocales, SearchOptions } from '../../shared/index.js'
import { onKeyStroke } from '@vueuse/core'
import {
  defineAsyncComponent,
  ref,
} from 'vue'
import SearchButton from './SearchButton.vue'

defineProps<{
  locales: SearchBoxLocales
  options: SearchOptions
}>()

const SearchBox = defineAsyncComponent(() => import('./SearchBox.vue'))

const showSearch = ref(false)

onKeyStroke('k', (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    showSearch.value = true
  }
})

onKeyStroke('/', (event) => {
  if (!isEditingContent(event)) {
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
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .search-wrapper {
    flex-grow: 1;
  }
}
</style>
