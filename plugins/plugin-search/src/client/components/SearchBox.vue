<script setup lang="ts">
import type { SearchBoxLocales, SearchOptions } from '../../shared/index.js'
import {
  computedAsync,
  debouncedWatch,
  onKeyStroke,
  useEventListener,
  useScrollLock,
  useSessionStorage,
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import Mark from 'mark.js/src/vanilla.js'
import MiniSearch, { type SearchResult } from 'minisearch'
import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  shallowRef,
  toRef,
  watch,
} from 'vue'
import { useRouteLocale, useRouter, withBase } from 'vuepress/client'
import { useLocale, useSearchIndex } from '../composables/index.js'
import { LRUCache } from '../utils/index.js'
import BackIcon from './icons/BackIcon.vue'
import ClearIcon from './icons/ClearIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'

const props = defineProps<{
  locales: SearchBoxLocales
  options: SearchOptions
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const routeLocale = useRouteLocale()
const locale = useLocale(toRef(props.locales))

const el = shallowRef<HTMLElement>()
const resultsEl = shallowRef<HTMLElement>()

const searchIndexData = useSearchIndex()

interface Result {
  title: string
  titles: string[]
  text?: string
}

const { activate } = useFocusTrap(el, {
  immediate: true,
})

const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value[routeLocale.value]?.())?.default,
      {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: { title: 4, text: 2, titles: 1 },
        },
        ...props.options.miniSearch?.searchOptions,
        ...props.options.miniSearch?.options,
      },
    ),
  ),
)

const disableQueryPersistence = computed(() =>
  props.options?.disableQueryPersistence === true,
)
const filterText = disableQueryPersistence.value
  ? ref('')
  : useSessionStorage('vuepress-plume:mini-search-filter', '')

const buttonText = computed(() => locale.value.buttonText || locale.value.placeholder || 'Search')

const results: Ref<(SearchResult & Result)[]> = shallowRef([])

const enableNoResults = ref(false)

watch(filterText, () => {
  enableNoResults.value = false
})

const mark = computedAsync(async () => {
  if (!resultsEl.value)
    return
  return markRaw(new Mark(resultsEl.value))
}, null)

const cache = new LRUCache<string, Map<string, string>>(16) // 16 files

debouncedWatch(
  () => [searchIndex.value, filterText.value] as const,
  async ([index, filterTextValue], old, onCleanup) => {
    if (old?.[0] !== index) {
      // in case of hmr
      cache.clear()
    }

    let canceled = false
    onCleanup(() => {
      canceled = true
    })

    if (!index)
      return

    // Search
    results.value = index
      .search(filterTextValue)
      .slice(0, 16)
      .map((r) => {
        r.titles = r.titles?.filter(Boolean) || []
        return r
      }) as (SearchResult & Result)[]
    enableNoResults.value = true

    const terms = new Set<string>()

    results.value = results.value.map((r) => {
      const [id, anchor] = r.id.split('#')
      const map = cache.get(id)
      const text = map?.get(anchor) ?? ''
      for (const term in r.match)
        terms.add(term)

      return { ...r, text }
    })

    await nextTick()
    if (canceled)
      return

    await new Promise((r) => {
      mark.value?.unmark({
        done: () => {
          mark.value?.markRegExp(formMarkRegex(terms), { done: r })
        },
      })
    })
  },
  { debounce: 200, immediate: true },
)

/* Search input focus */

const searchInput = ref<HTMLInputElement>()
const disableReset = computed(() => {
  return filterText.value?.length <= 0
})
function focusSearchInput(select = true) {
  searchInput.value?.focus()
  if (select) {
    searchInput.value?.select()
  }
}

onMounted(() => {
  focusSearchInput()
})

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse')
    focusSearchInput()
}

/* Search keyboard selection */

const selectedIndex = ref(-1)
const disableMouseOver = ref(false)

watch(results, (r) => {
  selectedIndex.value = r.length ? 0 : -1
  scrollToSelectedResult()
})

function scrollToSelectedResult() {
  nextTick(() => {
    const selectedEl = document.querySelector('.result.selected')
    if (selectedEl) {
      selectedEl.scrollIntoView({
        block: 'nearest',
      })
    }
  })
}

onKeyStroke('ArrowUp', (event) => {
  event.preventDefault()
  selectedIndex.value--
  if (selectedIndex.value < 0)
    selectedIndex.value = results.value.length - 1

  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowDown', (event) => {
  event.preventDefault()
  selectedIndex.value++
  if (selectedIndex.value >= results.value.length)
    selectedIndex.value = 0

  disableMouseOver.value = true
  scrollToSelectedResult()
})

const router = useRouter()

onKeyStroke('Enter', (e) => {
  if (e.isComposing)
    return

  if (e.target instanceof HTMLButtonElement && e.target.type !== 'submit')
    return

  const selectedPackage = results.value[selectedIndex.value]
  if (e.target instanceof HTMLInputElement && !selectedPackage) {
    e.preventDefault()
    return
  }

  if (selectedPackage) {
    router.push(selectedPackage.id)
    emit('close')
  }
})

onKeyStroke('Escape', () => {
  emit('close')
})

// Back

onMounted(() => {
  // Prevents going to previous site
  window.history.pushState(null, '', null)
})

useEventListener('popstate', (event) => {
  event.preventDefault()
  emit('close')
})

/** Lock body */
const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null)

onMounted(() => {
  nextTick(() => {
    isLocked.value = true
    nextTick().then(() => activate())
  })
})

onBeforeUnmount(() => {
  isLocked.value = false
})

function resetSearch() {
  filterText.value = ''
  nextTick().then(() => focusSearchInput(false))
}

function escapeRegExp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map(term => `(${escapeRegExp(term)})`)
      .join('|'),
    'gi',
  )
}

function selectedClick(e: MouseEvent, p: SearchResult & Result) {
  e.preventDefault()
  router.push(p.id)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="el"
      role="button"
      :aria-owns="results?.length ? 'localsearch-list' : undefined"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-labelledby="mini-search-label"
      class="VPLocalSearchBox"
    >
      <div class="backdrop" @click="$emit('close')" />

      <div class="shell">
        <form
          class="search-bar"
          @pointerup="onSearchBarClick($event)"
          @submit.prevent=""
        >
          <label
            id="localsearch-label"
            :title="buttonText"
            for="localsearch-input"
          >
            <SearchIcon class="search-icon" />
          </label>
          <div class="search-actions before">
            <button
              class="back-button"
              :title="locale.backButtonTitle"
              @click="$emit('close')"
            >
              <BackIcon />
            </button>
          </div>
          <input
            id="localsearch-input"
            ref="searchInput"
            v-model="filterText"
            :placeholder="buttonText"
            aria-labelledby="localsearch-label"
            class="search-input"
          >
          <div class="search-actions">
            <button
              class="clear-button"
              type="reset"
              :disabled="disableReset"
              :title="locale.resetButtonTitle"
              @click="resetSearch"
            >
              <ClearIcon />
            </button>
          </div>
        </form>

        <ul
          :id="results?.length ? 'localsearch-list' : undefined"
          ref="resultsEl"
          :role="results?.length ? 'listbox' : undefined"
          :aria-labelledby="results?.length ? 'localsearch-label' : undefined"
          class="results"
          @mousemove="disableMouseOver = false"
        >
          <li
            v-for="(p, index) in results"
            :key="p.id"
            role="option"
            :aria-selected="selectedIndex === index ? 'true' : 'false'"
          >
            <a
              :href="withBase(p.id)"
              class="result"
              :class="{
                selected: selectedIndex === index,
              }"
              :aria-label="[...p.titles, p.title].join(' > ')"
              @mouseenter="!disableMouseOver && (selectedIndex = index)"
              @focusin="selectedIndex = index"
              @click="selectedClick($event, p)"
            >
              <div>
                <div class="titles">
                  <span class="title-icon">#</span>
                  <span
                    v-for="(t, i) in p.titles"
                    :key="i"
                    class="title"
                  >
                    <span class="text" v-html="t" />
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m9 18l6-6l-6-6"
                      />
                    </svg>
                  </span>
                  <span class="title main">
                    <span class="text" v-html="p.title" />
                  </span>
                </div>
              </div>
            </a>
          </li>
          <li
            v-if="filterText && !results.length && enableNoResults"
            class="no-results"
          >
            {{ locale.noResultsText }} "<strong>{{ filterText }}</strong>"
          </li>
        </ul>

        <div class="search-keyboard-shortcuts">
          <span>
            <kbd :aria-label="locale.footer?.navigateUpKeyAriaLabel ?? ''">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19V5m-7 7l7-7l7 7"
                />
              </svg>
            </kbd>
            <kbd :aria-label="locale.footer?.navigateDownKeyAriaLabel ?? ''">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m7-7l-7 7l-7-7"
                />
              </svg>
            </kbd>
            {{ locale.footer?.navigateText ?? '' }}
          </span>
          <span>
            <kbd :aria-label="locale.footer?.selectKeyAriaLabel ?? ''">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentcolor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="m9 10l-5 5l5 5" />
                  <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </g>
              </svg>
            </kbd>
            {{ locale.footer?.selectText ?? '' }}
          </span>
          <span>
            <kbd :aria-label="locale.footer?.closeKeyAriaLabel ?? ''">esc</kbd>
            {{ locale.footer?.closeText ?? '' }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
:root {
  --vp-mini-search-bg: var(--vp-c-bg);
  --vp-mini-search-result-bg: var(--vp-c-bg);
  --vp-mini-search-result-border: var(--vp-c-divider);
  --vp-mini-search-result-selected-bg: var(--vp-c-bg);
  --vp-mini-search-result-selected-border: var(--vp-c-brand-1);
  --vp-mini-search-highlight-bg: var(--vp-c-brand-1);
  --vp-mini-search-highlight-text: var(--vp-c-neutral-inverse);
}
</style>

<style scoped>
svg {
  flex: none;
}

.VPLocalSearchBox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
  transition: opacity 0.5s;
}

.shell {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(100vw - 60px, 900px);
  height: min-content;
  max-height: min(100vh - 128px, 900px);
  padding: 12px;
  margin: 64px auto;
  background: var(--vp-mini-search-bg);
  border-radius: 6px;
}

@media (max-width: 767px) {
  .shell {
    width: 100vw;
    height: 100vh;
    max-height: none;
    margin: 0;
    border-radius: 0;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: text;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}

@media (max-width: 767px) {
  .search-bar {
    padding: 0 8px;
  }
}

.search-bar:focus-within {
  border-color: var(--vp-c-brand-1);
}

.search-icon {
  margin: 8px;
}

@media (max-width: 767px) {
  .search-icon {
    display: none;
  }
}

.search-input {
  width: 100%;
  padding: 6px 12px;
  font-size: inherit;
}

@media (max-width: 767px) {
  .search-input {
    padding: 6px 4px;
  }
}

.search-actions {
  display: flex;
  gap: 4px;
}

@media (any-pointer: coarse) {
  .search-actions {
    gap: 8px;
  }
}

@media (min-width: 769px) {
  .search-actions.before {
    display: none;
  }
}

.search-actions button {
  padding: 8px;
}

.search-actions button:not([disabled]):hover,
.toggle-layout-button.detailed-list {
  color: var(--vp-c-brand-1);
}

.search-actions button.clear-button:disabled {
  opacity: 0.37;
}

.search-keyboard-shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.8rem;
  line-height: 14px;
  opacity: 0.75;
}

.search-keyboard-shortcuts span {
  display: flex;
  gap: 4px;
  align-items: center;
}

@media (max-width: 767px) {
  .search-keyboard-shortcuts {
    display: none;
  }
}

.search-keyboard-shortcuts kbd {
  display: inline-block;
  min-width: 24px;
  padding: 3px 6px;
  text-align: center;
  vertical-align: middle;
  background: rgba(128, 128, 128, 0.1);
  border: 1px solid rgba(128, 128, 128, 0.15);
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden auto;
  overscroll-behavior: contain;
}

.result {
  display: flex;
  gap: 8px;
  align-items: center;
  line-height: 1rem;
  border: solid 2px var(--vp-mini-search-result-border);
  border-radius: 4px;
  outline: none;
  transition: none;
}

.result > div {
  width: 100%;
  margin: 12px;
  overflow: hidden;
}

@media (max-width: 767px) {
  .result > div {
    margin: 8px;
  }
}

.titles {
  position: relative;
  z-index: 1001;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 2px 0;
}

.title {
  display: flex;
  gap: 4px;
  align-items: center;
}

.title.main {
  font-weight: 500;
}

.title-icon {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  opacity: 0.5;
}

.title :deep(svg) {
  opacity: 0.5;
}

.result.selected {
  --vp-mini-search-result-bg: var(--vp-mini-search-result-selected-bg);

  border-color: var(--vp-mini-search-result-selected-border);
}

.titles :deep(mark) {
  padding: 0 2px;
  color: var(--vp-mini-search-highlight-text);
  background-color: var(--vp-mini-search-highlight-bg);
  border-radius: 2px;
}

.result.selected .titles,
.result.selected .title-icon {
  color: var(--vp-c-brand-1) !important;
}

.no-results {
  padding: 12px;
  font-size: 0.9rem;
  text-align: center;
}
</style>
