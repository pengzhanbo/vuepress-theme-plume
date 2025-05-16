<script setup lang="ts">
import type { ResolvedSidebarItem } from '../../shared/index.js'
import VPBadge from '@theme/global/VPBadge.vue'
import VPIcon from '@theme/VPIcon.vue'
import VPLink from '@theme/VPLink.vue'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { computed } from 'vue'
import { useSidebarControl } from '../composables/index.js'

import '@vuepress/helper/transition/fade-in-height-expand.css'

const props = defineProps<{
  item: ResolvedSidebarItem
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

const isSeparator = computed(() => props.item.link?.startsWith('---'))

const classes = computed(() => [
  [`level-${props.depth}`],
  { collapsible: collapsible.value },
  { collapsed: collapsed.value },
  { 'is-link': isLink.value },
  { 'is-active': isActiveLink.value },
  { 'has-active': hasActiveLink.value },
])

function onItemInteraction(e: MouseEvent | Event) {
  if ('key' in e && e.key !== 'Enter')
    return

  if (!props.item.link) {
    toggle()
  }
}

function onCaretClick() {
  if (props.item.link) {
    toggle()
  }
}
</script>

<template>
  <Component :is="sectionTag" class="vp-sidebar-item sidebar-item" :class="classes">
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

      <VPIcon v-if="item.icon" :name="item.icon" :class="{ separator: isSeparator }" />

      <VPLink
        v-if="item.link && !isSeparator"
        :tag="linkTag"
        class="link"
        :href="item.link"
      >
        <Component :is="textTag" class="text">
          <span v-html="item.text" />
          <VPBadge
            v-if="item.badge"
            class="vp-menu-badge"
            v-bind="typeof item.badge === 'string' ? { text: item.badge } : item.badge"
          />
        </Component>
      </VPLink>

      <Component :is="textTag" v-else class="text" :class="{ separator: isSeparator }">
        <span v-html="item.text" />
        <VPBadge
          v-if="item.badge"
          class="vp-menu-badge"
          v-bind="typeof item.badge === 'string' ? { text: item.badge } : item.badge"
        />
      </Component>

      <div
        v-if="item.collapsed != null"
        class="caret"
        role="button"
        aria-label="toggle section"
        tabindex="0"
        @click="onCaretClick"
        @keydown.enter="onCaretClick"
      >
        <span class="vpi-chevron-right caret-icon" />
      </div>
    </div>

    <template v-if="item.items && item.items.length && depth < 5">
      <FadeInExpandTransition>
        <div v-show="!collapsed">
          <div class="items">
            <VPSidebarItem
              v-for="i in item.items"
              :key="i.text"
              :item="i"
              :depth="depth + 1"
            />
          </div>
        </div>
      </FadeInExpandTransition>
    </template>
  </Component>
</template>

<style scoped>
.vp-sidebar-item.level-0 {
  padding-bottom: 24px;
}

.vp-sidebar-item.collapsed.level-0 {
  padding-bottom: 10px;
}

.item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.vp-sidebar-item.collapsible > .item {
  cursor: pointer;
}

.indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: -17px;
  width: 1px;
  transition: background-color var(--vp-t-color);
}

.vp-sidebar-item.level-1.is-active > .item > .indicator {
  width: 2px;
}

.vp-sidebar-item.level-1.is-active > .item > .indicator,
.vp-sidebar-item.level-2.is-active > .item > .indicator,
.vp-sidebar-item.level-3.is-active > .item > .indicator,
.vp-sidebar-item.level-4.is-active > .item > .indicator,
.vp-sidebar-item.level-5.is-active > .item > .indicator {
  background-color: var(--vp-c-brand-1);
}

.link {
  display: block;
  flex: 1 2;
}

.text {
  display: inline-block;
  flex-grow: 1;
  padding: 4px 0;
  font-size: 14px;
  line-height: 24px;
  vertical-align: middle;
  transition: color var(--vp-t-color);
}

.vp-sidebar-item.level-0 .text {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.vp-sidebar-item.level-1 .text,
.vp-sidebar-item.level-2 .text,
.vp-sidebar-item.level-3 .text,
.vp-sidebar-item.level-4 .text,
.vp-sidebar-item.level-5 .text {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.vp-sidebar-item.level-1 .text.separator,
.vp-sidebar-item.level-2 .text.separator,
.vp-sidebar-item.level-3 .text.separator,
.vp-sidebar-item.level-4 .text.separator,
.vp-sidebar-item.level-5 .text.separator {
  color: var(--vp-c-text-3);
}

.vp-sidebar-item.level-0 :deep(.vp-icon.separator),
.vp-sidebar-item.level-1 :deep(.vp-icon.separator),
.vp-sidebar-item.level-2 :deep(.vp-icon.separator),
.vp-sidebar-item.level-3 :deep(.vp-icon.separator),
.vp-sidebar-item.level-4 :deep(.vp-icon.separator),
.vp-sidebar-item.level-5 :deep(.vp-icon.separator) {
  color: var(--vp-c-text-3) !important;
}

.vp-sidebar-item.level-0.has-active > .item > .text,
.vp-sidebar-item.level-1.has-active > .item > .text,
.vp-sidebar-item.level-2.has-active > .item > .text,
.vp-sidebar-item.level-3.has-active > .item > .text,
.vp-sidebar-item.level-4.has-active > .item > .text,
.vp-sidebar-item.level-5.has-active > .item > .text,
.vp-sidebar-item.level-0.has-active > .item > .link > .text,
.vp-sidebar-item.level-1.has-active > .item > .link > .text,
.vp-sidebar-item.level-2.has-active > .item > .link > .text,
.vp-sidebar-item.level-3.has-active > .item > .link > .text,
.vp-sidebar-item.level-4.has-active > .item > .link > .text,
.vp-sidebar-item.level-5.has-active > .item > .link > .text {
  color: var(--vp-c-text-1);
}

.vp-sidebar-item.level-0.is-active > .item .link > .text,
.vp-sidebar-item.level-1.is-active > .item .link > .text,
.vp-sidebar-item.level-2.is-active > .item .link > .text,
.vp-sidebar-item.level-3.is-active > .item .link > .text,
.vp-sidebar-item.level-4.is-active > .item .link > .text,
.vp-sidebar-item.level-5.is-active > .item .link > .text {
  color: var(--vp-c-brand-1);
}

.vp-sidebar-item.level-0.is-link > .item > .link:hover .text,
.vp-sidebar-item.level-1.is-link > .item > .link:hover .text,
.vp-sidebar-item.level-2.is-link > .item > .link:hover .text,
.vp-sidebar-item.level-3.is-link > .item > .link:hover .text,
.vp-sidebar-item.level-4.is-link > .item > .link:hover .text,
.vp-sidebar-item.level-5.is-link > .item > .link:hover .text,
.vp-sidebar-item.level-0.is-link > .item > .link:hover :deep(.vp-icon),
.vp-sidebar-item.level-1.is-link > .item > .link:hover :deep(.vp-icon),
.vp-sidebar-item.level-2.is-link > .item > .link:hover :deep(.vp-icon),
.vp-sidebar-item.level-3.is-link > .item > .link:hover :deep(.vp-icon),
.vp-sidebar-item.level-4.is-link > .item > .link:hover :deep(.vp-icon),
.vp-sidebar-item.level-5.is-link > .item > .link:hover :deep(.vp-icon) {
  color: var(--vp-c-brand-1);
}

.caret {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -7px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color var(--vp-t-color);
}

.item :deep(.vp-icon) {
  align-self: baseline;
  margin: 0 0.25rem 0 0;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
  transform: translateY(9px);
}

.item :deep(.vp-icon-img) {
  height: 0.9em;
  margin: 0 0.25rem 0 0;
}

.item :deep(.vp-icon.fontawesome) {
  line-height: 1;
}

.item:hover .caret {
  color: var(--vp-c-text-2);
}

.item:hover .caret:hover {
  color: var(--vp-c-text-1);
}

.vp-sidebar-item.level-0.is-active > .item > :deep(.vp-icon),
.vp-sidebar-item.level-1.is-active > .item > :deep(.vp-icon),
.vp-sidebar-item.level-2.is-active > .item > :deep(.vp-icon),
.vp-sidebar-item.level-3.is-active > .item > :deep(.vp-icon),
.vp-sidebar-item.level-4.is-active > .item > :deep(.vp-icon),
.vp-sidebar-item.level-5.is-active > .item > :deep(.vp-icon) {
  color: var(--vp-c-brand-1);
}

.vp-sidebar-item.level-0.is-link > .item:hover :deep(.vp-icon),
.vp-sidebar-item.level-1.is-link > .item:hover :deep(.vp-icon),
.vp-sidebar-item.level-2.is-link > .item:hover :deep(.vp-icon),
.vp-sidebar-item.level-3.is-link > .item:hover :deep(.vp-icon),
.vp-sidebar-item.level-4.is-link > .item:hover :deep(.vp-icon),
.vp-sidebar-item.level-5.is-link > .item:hover :deep(.vp-icon) {
  color: var(--vp-c-brand-1);
}

.caret-icon {
  width: 18px;
  height: 18px;
  fill: currentcolor;
  transition: transform var(--vp-t-color);
  transform: rotate(90deg);
}

.vp-sidebar-item.collapsed .caret-icon {
  transform: rotate(0);
}

.vp-sidebar-item.level-1 .items,
.vp-sidebar-item.level-2 .items,
.vp-sidebar-item.level-3 .items,
.vp-sidebar-item.level-4 .items,
.vp-sidebar-item.level-5 .items {
  padding-left: 16px;
  border-left: 1px solid var(--vp-c-divider);
  transition: border-left var(--vp-t-color);
}

.vp-sidebar-item .text :deep(.vp-menu-badge) {
  padding: 3px 4px;
  margin-top: 0;
  margin-left: 4px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.2px;
  border-radius: 6px;
}

.vp-sidebar-item.collapsible > .item .text :deep(.vp-menu-badge) {
  transform: translateY(3px);
}
</style>
