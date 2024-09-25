<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  type: 'file' | 'folder'
  expanded: boolean
  empty: boolean
}>()

const active = ref(!!props.expanded)
const el = ref<HTMLElement>()

function toggle(e: HTMLElementEventMap['click']) {
  const target = e.target as HTMLElement
  if (target.matches('.comment') || e.currentTarget === target)
    return
  active.value = !active.value
}

onMounted(() => {
  if (!el.value || props.type !== 'folder')
    return

  el.value.querySelector('.tree-node.folder')?.addEventListener(
    'click',
    toggle as EventListener,
  )
})

onUnmounted(() => {
  if (!el.value || props.type !== 'folder')
    return

  el.value.querySelector('.tree-node.folder')?.removeEventListener(
    'click',
    toggle as EventListener,
  )
})
</script>

<template>
  <li ref="el" class="file-tree-item" :class="{ expanded: active }">
    <slot />
    <ul v-if="props.type === 'folder' && props.empty">
      <li class="file-tree-item">
        <span class="tree-node file">
          <span class="name">…</span>
        </span>
      </li>
    </ul>
  </li>
</template>

<style>
.vp-file-tree {
  width: fit-content;
  max-width: 100%;
  padding: 16px;
  font-size: 14px;
  background-color: var(--vp-c-bg-safe);
  border: solid 1px var(--vp-c-divider);
  border-radius: 8px;
  transition: border var(--vp-t-color), background-color var(--vp-t-color);
}

.vp-file-tree .vp-file-tree-title {
  padding-left: 16px;
  margin: -16px -16px 0;
  font-weight: bold;
  color: var(--vp-c-text-1);
  border-bottom: solid 1px var(--vp-c-divider);
  transition: color var(--vp-t-color), border-color var(--vp-t-color);
}

.vp-file-tree ul {
  padding: 0 !important;
  margin: 0 !important;
  list-style: none !important;
}

.file-tree-item {
  margin-left: 14px;
}

.vp-file-tree .file-tree-item {
  margin-top: 0;
}

.file-tree-item .tree-node {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  margin: 4px 0;
}

.file-tree-item .tree-node .name {
  font-family: var(--vp-font-family-mono);
}

.file-tree-item .tree-node.folder {
  position: relative;
}

.file-tree-item .tree-node.folder > .name {
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: color var(--vp-t-color);
}

.file-tree-item .tree-node.folder > .name:hover {
  color: var(--vp-c-brand-1);
}

.file-tree-item .tree-node.folder::before {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5.536 21.886a1 1 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886'/%3E%3C/svg%3E");

  position: absolute;
  top: 7px;
  left: -14px;
  display: block;
  width: 10px;
  height: 10px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  content: "";
  background-color: currentcolor;
  -webkit-mask: var(--icon) no-repeat;
  mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  transition: color var(--vp-t-color);
}

.file-tree-item .tree-node .name.focus {
  position: relative;
  padding: 0 4px;
  margin: 0 -4px;
  font-weight: bold;
  color: var(--vp-c-bg);
  background-color: var(--vp-c-brand-2);
  border-radius: 4px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.file-tree-item .tree-node .name.focus:hover {
  color: var(--vp-c-bg);
  background-color: var(--vp-c-brand-1);
}

.file-tree-item .tree-node .comment {
  margin-left: 20px;
  overflow: hidden;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.file-tree-item .tree-node [class*="vpi-"] {
  width: 1.2em;
  height: 1.2em;
  margin: 0;
}

.file-tree-item .tree-node.folder [class*="vpi-"] {
  cursor: pointer;
}

.vp-file-tree .file-tree-item > ul {
  padding-left: 8px !important;
  margin: 0 0 0 6px !important;
  border-left: solid 1px var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.file-tree-item:not(.expanded) > ul {
  display: none;
}

.file-tree-item.expanded > .tree-node.folder::before {
  transform: rotate(90deg);
}
</style>
