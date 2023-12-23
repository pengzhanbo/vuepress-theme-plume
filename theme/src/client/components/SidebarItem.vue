<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { NotesSidebarItem } from '@vuepress-plume/plugin-notes-data'
import { computed } from 'vue'
import { useSidebarControl } from '../composables/sidebar.js'
import AutoLink from './AutoLink.vue'
import IconChevronRight from './icons/IconChevronRight.vue'

const props = defineProps<{
  item: NotesSidebarItem
  depth: number
}>()

const {
  collapsed,
  collapsible,
  isLink,
  isActiveLink,
  hasActiveLink,
  hasChildren,
  toggle,
} = useSidebarControl(computed(() => props.item))

const sectionTag = computed(() => (hasChildren.value ? 'section' : `div`))

const linkTag = computed(() => (isLink.value ? 'a' : 'div'))

const textTag = computed(() => {
  return !hasChildren.value
    ? 'p'
    : props.depth + 2 === 7
    ? 'p'
    : `h${props.depth + 2}`
})

const itemRole = computed(() => (isLink.value ? undefined : 'button'))

const classes = computed(() => [
  [`level-${props.depth}`],
  { collapsible: collapsible.value },
  { collapsed: collapsed.value },
  { 'is-link': isLink.value },
  { 'is-active': isActiveLink.value },
  { 'has-active': hasActiveLink.value },
])

function onItemInteraction(e: MouseEvent | Event) {
  if ('key' in e && e.key !== 'Enter') {
    return
  }
  !props.item.link && toggle()
}

function onCaretClick() {
  props.item.link && toggle()
}
</script>

<template>
  <Component :is="sectionTag" class="sidebar-item" :class="classes">
    <div
      v-if="item.text"
      class="item"
      :role="itemRole"
      :tabindex="item.items && 0"
      v-on="item.items
        ? { click: onItemInteraction, keydown: onItemInteraction }
        : {}
      "
    >
      <div class="indicator" />

      <AutoLink v-if="item.link" :tag="linkTag" class="link" :href="item.link">
        <!-- eslint-disable vue/no-v-text-v-html-on-component -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <Component :is="textTag" class="text" v-html="item.text" />
      </AutoLink>
      <!-- eslint-disable vue/no-v-text-v-html-on-component -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <Component :is="textTag" v-else class="text" v-html="item.text" />

      <div
        v-if="item.collapsed != null"
        class="caret"
        role="button"
        aria-label="toggle section"
        tabindex="0"
        @click="onCaretClick"
        @keydown.enter="onCaretClick"
      >
        <IconChevronRight class="caret-icon" />
      </div>
    </div>

    <div v-if="item.items && item.items.length" class="items">
      <template v-if="depth < 5">
        <SidebarItem
          v-for="i in (item.items as NotesSidebarItem[])"
          :key="i.text"
          :item="i"
          :depth="depth + 1"
        />
      </template>
    </div>
  </Component>
</template>

<style scoped>
.sidebar-item.level-0 {
  padding-bottom: 24px;
}

.sidebar-item.collapsed.level-0 {
  padding-bottom: 10px;
}

.item {
  position: relative;
  display: flex;
  width: 100%;
}

.sidebar-item.collapsible > .item {
  cursor: pointer;
}

.indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: -17px;
  width: 1px;
  transition: background-color 0.25s;
}

.sidebar-item.level-2.is-active > .item > .indicator,
.sidebar-item.level-3.is-active > .item > .indicator,
.sidebar-item.level-4.is-active > .item > .indicator,
.sidebar-item.level-5.is-active > .item > .indicator {
  background-color: var(--vp-c-brand);
}

.link {
  display: block;
  flex-grow: 1;
}

.text {
  flex-grow: 1;
  padding: 4px 0;
  line-height: 24px;
  font-size: 14px;
  transition: color 0.25s;
}

.sidebar-item.level-0 .text {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.sidebar-item.level-1 .text,
.sidebar-item.level-2 .text,
.sidebar-item.level-3 .text,
.sidebar-item.level-4 .text,
.sidebar-item.level-5 .text {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.sidebar-item.level-0.is-link > .item > .link:hover .text,
.sidebar-item.level-1.is-link > .item > .link:hover .text,
.sidebar-item.level-2.is-link > .item > .link:hover .text,
.sidebar-item.level-3.is-link > .item > .link:hover .text,
.sidebar-item.level-4.is-link > .item > .link:hover .text,
.sidebar-item.level-5.is-link > .item > .link:hover .text {
  color: var(--vp-c-brand);
}

.sidebar-item.level-0.has-active > .item > .link > .text,
.sidebar-item.level-1.has-active > .item > .link > .text,
.sidebar-item.level-2.has-active > .item > .link > .text,
.sidebar-item.level-3.has-active > .item > .link > .text,
.sidebar-item.level-4.has-active > .item > .link > .text,
.sidebar-item.level-5.has-active > .item > .link > .text {
  color: var(--vp-c-text-1);
}

.sidebar-item.level-0.is-active > .item .link > .text,
.sidebar-item.level-1.is-active > .item .link > .text,
.sidebar-item.level-2.is-active > .item .link > .text,
.sidebar-item.level-3.is-active > .item .link > .text,
.sidebar-item.level-4.is-active > .item .link > .text,
.sidebar-item.level-5.is-active > .item .link > .text {
  color: var(--vp-c-brand);
}

.caret {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -7px;
  width: 32px;
  height: 32px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.25s;
}

.item:hover .caret {
  color: var(--vp-c-text-2);
}

.item:hover .caret:hover {
  color: var(--vp-c-text-1);
}

.caret-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  transform: rotate(90deg);
  transition: transform 0.25s;
}

.sidebar-item.collapsed .caret-icon {
  transform: rotate(0);
}

.sidebar-item.level-1 .items,
.sidebar-item.level-2 .items,
.sidebar-item.level-3 .items,
.sidebar-item.level-4 .items,
.sidebar-item.level-5 .items {
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 16px;
}

.sidebar-item.collapsed .items {
  display: none;
}
</style>
