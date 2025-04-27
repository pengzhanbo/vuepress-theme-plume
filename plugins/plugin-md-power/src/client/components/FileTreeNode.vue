<script setup lang="ts">
import type { Ref } from 'vue'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { inject, ref } from 'vue'

import '@vuepress/helper/transition/fade-in-height-expand.css'

const props = defineProps<{
  type: 'file' | 'folder'
  filename: string
  expanded?: boolean
  focus?: boolean
}>()

const activeFileTreeNode = inject<Ref<string>>('active-file-tree-node', ref(''))

const onNodeClick = inject<
  (filename: string, type: 'file' | 'folder') => void
>('on-file-tree-node-click', () => {})

const active = ref(props.expanded)

function nodeClick() {
  if (props.filename === '…' || props.filename === '...')
    return

  onNodeClick(props.filename, props.type)
}

function toggle(ev: MouseEvent) {
  if (props.type === 'folder') {
    const el = ev.target as HTMLElement
    if (!el.matches('.comment, .comment *')) {
      active.value = !active.value
      nodeClick()
    }
  }
  else {
    nodeClick()
  }
}
</script>

<template>
  <div class="vp-file-tree-node">
    <p
      class="vp-file-tree-info" :class="{
        [type]: true,
        focus,
        expanded: type === 'folder' ? active : false,
        active: type === 'file' ? activeFileTreeNode === filename : false,
      }"
      @click="toggle"
    >
      <slot name="icon" />
      <span class="name" :class="[type]">{{ filename }}</span>
      <span v-if="$slots.comment" class="comment"><slot name="comment" /></span>
    </p>
    <FadeInExpandTransition>
      <div v-if="type === 'folder'" v-show="active" class="group">
        <slot />
      </div>
    </FadeInExpandTransition>
  </div>
</template>

<style>
.vp-file-tree {
  max-width: 100%;
  padding: 16px;
  overflow: auto hidden;
  font-size: 14px;
  background-color: var(--vp-c-bg-safe);
  border: solid 1px var(--vp-c-divider);
  border-radius: 8px;
  transition: border var(--vp-t-color), background-color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-title {
  padding: 8px 16px;
  margin: -16px -16px 8px;
  font-weight: bold;
  color: var(--vp-c-text-1);
  border-bottom: solid 1px var(--vp-c-divider);
  transition: color var(--vp-t-color), border-color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-info {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  height: 28px;
  padding: 2px 0;
  margin: 0 0 0 16px;
  line-height: 24px;
  text-wrap: nowrap;
}

.vp-file-tree .vp-file-tree-info::after {
  position: absolute;
  top: 1px;
  right: 0;
  bottom: 1px;
  left: -16px;
  z-index: 0;
  display: block;
  pointer-events: none;
  content: "";
  background-color: transparent;
  border-radius: 6px;
  transition: background-color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-info.active::after,
.vp-file-tree .vp-file-tree-info:hover::after {
  background-color: var(--vp-c-default-soft);
}

.vp-file-tree .vp-file-tree-info.folder {
  cursor: pointer;
}

.vp-file-tree .vp-file-tree-info.folder::before {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='m5.157 13.069l4.611-4.685a.546.546 0 0 0 0-.768L5.158 2.93a.55.55 0 0 1 0-.771a.53.53 0 0 1 .759 0l4.61 4.684a1.65 1.65 0 0 1 0 2.312l-4.61 4.684a.53.53 0 0 1-.76 0a.55.55 0 0 1 0-.771'/%3E%3C/svg%3E");

  position: absolute;
  top: 8px;
  left: -16px;
  display: block;
  width: 12px;
  height: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  content: "";
  background-color: currentcolor;
  -webkit-mask: var(--icon) no-repeat;
  mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  transition: color var(--vp-t-color), transform var(--vp-t-color);
  transform: rotate(0);
}

.vp-file-tree .vp-file-tree-info.folder.expanded::before {
  transform: rotate(90deg);
}

.vp-file-tree .vp-file-tree-info .name {
  position: relative;
  font-family: var(--vp-font-family-mono);
}

.vp-file-tree .vp-file-tree-info.folder .name {
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-info.focus .name {
  padding: 0 4px;
  margin: 0 -4px;
  font-weight: bold;
  color: var(--vp-c-bg);
  background-color: var(--vp-c-brand-2);
  border-radius: 4px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-info.active .name {
  color: var(--vp-c-brand-1);
}

.vp-file-tree .vp-file-tree-info:not(.focus).folder .name:hover {
  color: var(--vp-c-brand-1);
}

.vp-file-tree .vp-file-tree-info .comment {
  display: inline-block;
  flex: 1 2;
  height: 28px;
  padding-right: 16px;
  padding-left: 20px;
  margin: -2px 0;
  color: var(--vp-c-text-3);
  cursor: auto;
  transition: color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-node .group {
  position: relative;
  margin-left: 28px;
}

.vp-file-tree .vp-file-tree-node .group::before {
  position: absolute;
  top: 0;
  left: -4px;
  width: 1px;
  height: 100%;
  content: "";
  background-color: var(--vp-c-divider);
  transition: background-color var(--vp-t-color);
}

.vp-file-tree [class*="vpi-"] {
  width: 1.2em;
  height: 1.2em;
  margin: 0;
}
</style>
