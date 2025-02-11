<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { onMounted, ref, shallowRef, watch } from 'vue'

interface TabProps extends Record<string, unknown> {
  id: string
}
const props = withDefaults(defineProps<{
  id: string
  tabId?: string
  active?: number
  data: TabProps[]
}>(), { active: 0, tabId: '' })

const CODE_TAB_STORE_NAME = 'VUEPRESS_CODE_TAB_STORE'
const codeTabStore = useStorage<Record<string, string>>(CODE_TAB_STORE_NAME, {})

// Index of current active item
const activeIndex = ref(props.active)

// Refs of the tab buttons
const tabRefs = shallowRef<HTMLUListElement[]>([])

// Update store
function updateStore(): void {
  if (props.tabId)
    codeTabStore.value[props.tabId] = props.data[activeIndex.value].id
}

// Activate next tab
function activateNext(index = activeIndex.value): void {
  activeIndex.value = index < tabRefs.value.length - 1 ? index + 1 : 0
  tabRefs.value[activeIndex.value].focus()
}

// Activate previous tab
function activatePrev(index = activeIndex.value): void {
  activeIndex.value = index > 0 ? index - 1 : tabRefs.value.length - 1
  tabRefs.value[activeIndex.value].focus()
}

// Handle keyboard event
function keyboardHandler(event: KeyboardEvent, index: number): void {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    activeIndex.value = index
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    activateNext()
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    activatePrev()
  }

  if (props.tabId)
    codeTabStore.value[props.tabId] = props.data[activeIndex.value].id
}

function getInitialIndex(): number {
  if (props.tabId) {
    const valueIndex = props.data.findIndex(
      ({ id }) => codeTabStore.value[props.tabId] === id,
    )

    if (valueIndex !== -1)
      return valueIndex
  }

  return props.active
}

onMounted(() => {
  activeIndex.value = getInitialIndex()

  watch(
    () => codeTabStore.value[props.tabId],
    (newValue, oldValue) => {
      if (props.tabId && newValue !== oldValue) {
        const index = props.data.findIndex(({ id }) => id === newValue)

        if (index !== -1)
          activeIndex.value = index
      }
    },
  )
})
function onTabNavClick(index: number): void {
  activeIndex.value = index
  updateStore()
}
</script>

<template>
  <div v-if="data.length" class="vp-code-tabs">
    <div class="vp-code-tabs-nav" role="tablist">
      <button
        v-for="(item, index) in data"
        :key="index"
        :ref="(el) => el && (tabRefs[index] = el as HTMLUListElement)"
        class="vp-code-tab-nav" :class="{ active: index === activeIndex }"
        type="button" role="tab"
        :aria-controls="`codetab-${id}-${index}`"
        :aria-selected="index === activeIndex"
        @click="() => onTabNavClick(index)"
        @keydown="(e) => keyboardHandler(e, index)"
      >
        <slot :name="`title${index}`" :value="item.id" :is-active="index === activeIndex" />
      </button>
    </div>
    <div
      v-for="(item, index) in data"
      :id="`codetab-${id}-${index}`" :key="index"
      class="vp-code-tab" :class="{ active: index === activeIndex }"
      role="tabpanel" :aria-expanded="index === activeIndex"
    >
      <div class="vp-code-tab-title">
        <slot :name="`title${index}`" :value="item.id" :is-active="index === activeIndex" />
      </div>
      <slot :name="`tab${index}`" :value="item.id" :is-active="index === activeIndex" />
    </div>
  </div>
</template>

<style>
.vp-code-tabs-nav {
  padding: 0 12px;
  margin: 16px 0 0;
  overflow: auto hidden;
  white-space: nowrap;
  list-style: none;
  background-color: var(--vp-code-tab-bg);
  border-radius: 6px 6px 0 0;
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
  transition: background-color var(--vp-t-color), box-shadow var(--vp-t-color);

  scrollbar-width: thin;
}

@media print {
  .vp-code-tabs-nav {
    display: none;
  }
}

@media (max-width: 639px) {
  .vp-code-tabs-nav {
    margin: 16px -24px 0;
    border-radius: 0;
  }

  .vp-doc li .vp-code-tabs-nav {
    border-top-left-radius: 6px;
  }
}

.vp-code-tab-nav {
  position: relative;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 48px;
  color: var(--vp-code-tab-text-color);
  white-space: nowrap;
  border-bottom: 1px solid transparent;
  transition: color var(--vp-t-color);
}

.vp-code-tab-nav:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.vp-code-tab-nav::after {
  position: absolute;
  right: 8px;
  bottom: -1px;
  left: 8px;
  z-index: 1;
  display: block;
  width: auto;
  height: 2px;
  content: "";
  background: transparent;
  border-radius: 2px;
  transition: background var(--vp-t-color);
}

.vp-code-tab-nav:focus-visible {
  outline: none;
}

.vp-code-tab-nav.active {
  color: var(--vp-code-tab-active-text-color);
  background: transparent;
}

.vp-code-tab-nav.active::after {
  background: var(--vp-code-tab-active-bar-color);
}

.vp-code-tab-nav .vp-icon {
  width: 18px;
  height: 18px;
  margin-left: 0;
}

.vp-code-tab-nav span {
  vertical-align: middle;
}

@media (max-width: 419px) {
  .hint-container .vp-code-tabs-nav {
    margin: 0.85rem -0.75rem 0 -1rem;
  }
}

.vp-code-tab {
  display: none;
}

@media print {
  .vp-code-tab {
    display: block;
  }
}

.vp-code-tab.active {
  display: block;
}

.vp-doc .vp-code-tab div[class*="language-"] {
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.vp-code-tab-title {
  display: none;
}

@media print {
  .vp-code-tab-title {
    display: block;
  }
}
</style>
