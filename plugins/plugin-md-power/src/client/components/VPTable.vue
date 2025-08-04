<script setup lang="ts">
import { decodeData } from '@vuepress/helper/client'
import { useClipboard, useToggle } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'

const props = defineProps<{
  /** 表格标题 */
  title?: string
  /** 对其方式 */
  align?: 'left' | 'center' | 'right'
  /** 复制为 html/markdown */
  copy?: false | 'all' | 'html' | 'md'
  /** 最大化内容 */
  maxContent?: boolean
  /** @internal */
  markdown?: string
}>()

const tableEl = useTemplateRef('table')
const rawContent = computed(() => props.markdown ? decodeData(props.markdown) : '')

const [isHTMLCopied, toggleHTMLCopy] = useToggle()
const [isMDCopied, toggleMDCopy] = useToggle()
const { copy: copyTable } = useClipboard()

function onCopy(type: 'html' | 'md') {
  copyTable(type === 'md' ? rawContent.value : tableEl.value?.innerHTML || '')
  type === 'html' ? toggleHTMLCopy(true) : toggleMDCopy(true)
  setTimeout(() => {
    type === 'html' ? toggleHTMLCopy(false) : toggleMDCopy(false)
  }, 1500)
}
</script>

<template>
  <div class="vp-table" :class="{ [align || 'left']: true }">
    <div class="table-container">
      <div class="table-content">
        <div v-if="copy" class="table-toolbar">
          <button
            v-if="copy === 'all' || copy === 'html'"
            type="button"
            aria-label="Copy Table as HTML"
            @click="onCopy('html')"
          >
            <span :class="isHTMLCopied ? 'vpi-table-copied' : 'vpi-table-copy'" />
            <span>HTML</span>
          </button>
          <button
            v-if="copy === 'all' || copy === 'md'"
            type="button"
            aria-label="Copy Table as Markdown"
            @click="onCopy('md')"
          >
            <span :class="isMDCopied ? 'vpi-table-copied' : 'vpi-table-copy'" />
            <span>Markdown</span>
          </button>
        </div>
        <div ref="table" :class="{ 'max-content': maxContent }">
          <slot />
        </div>
      </div>
      <p v-if="title" class="table-title">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<style>
.vp-table {
  display: flex;
  max-width: 100%;
  margin: 16px 0;
}

.vp-table.left {
  justify-content: flex-start;
}

.vp-table.center {
  justify-content: center;
}

.vp-table.right {
  justify-content: flex-end;
}

.vp-table .table-container,
.vp-table .table-content {
  width: fit-content;
  max-width: 100%;
}

.vp-table .table-content {
  margin: 0 auto;
}

.vp-table .table-title {
  margin: 8px auto;
  font-weight: 500;
  text-align: center;
}

.vp-table .table-container table {
  margin: 0;
}

.vp-table .table-toolbar {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.vp-table .table-toolbar button {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 14px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: var(--vp-t-color);
  transition-property: color;
}

.vp-table .table-toolbar button:hover {
  color: var(--vp-c-text-2);
}

.vpi-table-copy {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M20.829 12.861c.171-.413.171-.938.171-1.986s0-1.573-.171-1.986a2.25 2.25 0 0 0-1.218-1.218c-.413-.171-.938-.171-1.986-.171H11.1c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C7.5 9.209 7.5 9.839 7.5 11.1v6.525c0 1.048 0 1.573.171 1.986c.229.551.667.99 1.218 1.218c.413.171.938.171 1.986.171s1.573 0 1.986-.171m7.968-7.968a2.25 2.25 0 0 1-1.218 1.218c-.413.171-.938.171-1.986.171s-1.573 0-1.986.171a2.25 2.25 0 0 0-1.218 1.218c-.171.413-.171.938-.171 1.986s0 1.573-.171 1.986a2.25 2.25 0 0 1-1.218 1.218m7.968-7.968a11.68 11.68 0 0 1-7.75 7.9l-.218.068M16.5 7.5v-.9c0-1.26 0-1.89-.245-2.371a2.25 2.25 0 0 0-.983-.984C14.79 3 14.16 3 12.9 3H6.6c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C3 4.709 3 5.339 3 6.6v6.3c0 1.26 0 1.89.245 2.371c.216.424.56.768.984.984c.48.245 1.111.245 2.372.245H7.5'/%3E%3C/svg%3E");
}

.vpi-table-copied {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z'/%3E%3C/svg%3E");
}

.vp-table .table-content .max-content {
  max-width: 100%;
  overflow-x: auto;
}

.vp-table .table-content .max-content table {
  width: max-content;
}

/* -----  Highlight --------- */
.vp-table table th.tip,
.vp-table table td.tip,
.vp-table table th.note,
.vp-table table td.note {
  color: var(--vp-c-tip-1);
  background-color: var(--vp-c-tip-soft);
}

.vp-table table th.info,
.vp-table table td.info {
  color: var(--vp-c-default-1);
  background-color: var(--vp-c-default-soft);
}

.vp-table table th.warning,
.vp-table table td.warning {
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
}

.vp-table table th.danger,
.vp-table table td.danger,
.vp-table table th.caution,
.vp-table table td.caution {
  color: var(--vp-c-danger-1);
  background-color: var(--vp-c-danger-soft);
}

.vp-table table th.success,
.vp-table table td.success {
  color: var(--vp-c-success-1);
  background-color: var(--vp-c-success-soft);
}

.vp-table table th.important,
.vp-table table td.important {
  color: var(--vp-c-important-1);
  background-color: var(--vp-c-important-soft);
}
</style>
