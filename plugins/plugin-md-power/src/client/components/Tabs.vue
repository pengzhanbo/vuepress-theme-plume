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

const TAB_STORE_NAME = 'VUEPRESS_TAB_STORE'

const tabStore = useStorage<Record<string, string>>(TAB_STORE_NAME, {})

// Index of current active item
const activeIndex = ref(props.active)

// Refs of the tab buttons
const tabRefs = shallowRef<HTMLUListElement[]>([])

// Update store
function updateStore(): void {
  if (props.tabId)
    tabStore.value[props.tabId] = props.data[activeIndex.value].id
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

  updateStore()
}

function getInitialIndex(): number {
  if (props.tabId) {
    const valueIndex = props.data.findIndex(
      ({ id }) => tabStore.value[props.tabId] === id,
    )

    if (valueIndex !== -1)
      return valueIndex
  }

  return props.active
}

onMounted(() => {
  activeIndex.value = getInitialIndex()

  watch(
    () => tabStore.value[props.tabId],
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
  <div v-if="data.length" class="vp-tabs">
    <div class="vp-tabs-nav" role="tablist">
      <button
        v-for="(item, index) in data"
        :key="index"
        :ref="(el) => el && (tabRefs[index] = el as HTMLUListElement)"
        class="vp-tab-nav" :class="{ active: index === activeIndex }"
        type="button" role="tab"
        :aria-controls="`tab-${id}-${index}`"
        :aria-selected="index === activeIndex"
        @click="() => onTabNavClick(index)"
        @keydown="(e) => keyboardHandler(e, index)"
      >
        <slot :name="`title${index}`" :value="item.id" :is-active="index === activeIndex" />
      </button>
    </div>
    <div
      v-for="(item, index) in data"
      :id="`tab-${id}-${index}`" :key="index"
      class="vp-tab" :class="{ active: index === activeIndex }"
      role="tabpanel" :aria-expanded="index === activeIndex"
    >
      <div class="vp-tab-title">
        <slot :name="`title${index}`" :value="item.id" :is-active="index === activeIndex" />
      </div>
      <slot :name="`tab${index}`" :value="item.id" :is-active="index === activeIndex" />
    </div>
  </div>
</template>

<style>
.vp-tabs {
  margin: 16px 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  transition: border var(--vp-t-color);
}

@media (max-width: 419px) {
  .vp-tabs {
    margin: 16px -24px;
    border: none;
    border-bottom: 1px solid var(--vp-c-divider);
    border-radius: 0;
  }
}

.vp-doc .vp-tabs-nav {
  padding: 0 12px;
  overflow-x: auto;
  white-space: nowrap;
  background-color: var(--vp-code-tab-bg);
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
  transition: background-color var(--vp-t-color), box-shadow var(--vp-t-color);
}

@media print {
  .vp-doc .vp-tabs-nav {
    display: none;
  }
}

.vp-doc .vp-tab-nav {
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

.vp-doc .vp-tab-nav:hover {
  color: var(--vp-code-tab-text-hover-color);
}

.vp-doc .vp-tab-nav::after {
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

.vp-doc .vp-tab-nav.active {
  color: var(--vp-code-tab-active-text-color);
  background: transparent;
}

.vp-doc .vp-tab-nav.active::after {
  background: var(--vp-code-tab-active-bar-color);
}

.vp-doc .vp-tab {
  display: none;
  padding: 16px;
}

.vp-doc .vp-tab > :nth-child(2) {
  margin-top: 0;
}

.vp-doc .vp-tab > :last-child {
  margin-bottom: 0;
}

.vp-doc .vp-tab.active {
  display: block;
}

.vp-doc .vp-tab-title {
  display: none;
  padding: 4px;
  font-weight: 500;
  color: var(--vp-code-tab-text-color);
  border-top: 1px solid var(--vp-c-divider);
  transition: color var(--vp-t-color);
}

.vp-doc .vp-tab:nth-child(n+2) .vp-tab-title {
  border-top: none;
}

@media print {
  .vp-doc .vp-tab-title {
    display: block;
  }
}

.vp-doc .hint-container .vp-tabs {
  margin: 8px 0;
}

@media (max-width: 419px) {
  .vp-doc .hint-container .vp-tabs {
    margin: 8px -16px;
  }
}

.vp-doc .hint-container .vp-tab-nav {
  line-height: 40px;
}

.vp-doc .hint-container.info .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-info-code-bg);
}

.vp-doc .hint-container.note .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-note-code-bg);
}

.vp-doc .hint-container.tip .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-tip-code-bg);
}

.vp-doc .hint-container.warning .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-warning-code-bg);
}

.vp-doc .hint-container.danger .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-danger-code-bg);
}

.vp-doc .hint-container.caution .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-caution-code-bg);
}

.vp-doc .hint-container.important .vp-tabs .vp-tabs-nav {
  --vp-code-tab-bg: var(--vp-custom-block-important-code-bg);
}
</style>
