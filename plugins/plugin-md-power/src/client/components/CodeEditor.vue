<script setup lang="ts">
import type { HighlighterCore } from 'shiki/core'
import editorData from '@internal/md-power/replEditorData'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { resolveCodeInfo } from '../composables/codeRepl.js'

let highlighter: HighlighterCore | null = null
let container: HTMLPreElement | null = null
let lineNumbers: HTMLDivElement | null = null
const { grammars, theme } = editorData

const lang = ref<'go' | 'rust' | 'kotlin'>()

const editorEl = shallowRef<HTMLDivElement>()
const textAreaEl = shallowRef<HTMLTextAreaElement>()
const input = ref('')

async function init() {
  highlighter = await createHighlighterCore({
    themes: 'light' in theme && 'dark' in theme ? [theme.light, theme.dark] : [theme],
    langs: Object.keys(grammars).map(key => grammars[key]),
    engine: createOnigurumaEngine(() => import('shiki/wasm')),
  })
}

function highlight() {
  if (highlighter && lang.value && input.value) {
    const output = highlighter.codeToHtml(input.value, {
      lang: lang.value,
      ...('light' in theme && 'dark' in theme
        ? { themes: theme, defaultColor: false }
        : { theme }),
    })
    if (container) {
      container.innerHTML = output
        .replace(/^<pre[^>]*>/, '')
        .replace(/<\/pre>$/, '')
        .replace(/(<span class="line">)(<\/span>)/g, '$1<wbr>$2')
    }
    if (lineNumbers) {
      lineNumbers.innerHTML = output
        .split('\n')
        .map(() => '<div class="line-number"></div>')
        .join('')
    }
  }
}

function updateScroll() {
  if (container) {
    container.scrollLeft = textAreaEl.value?.scrollLeft || 0
  }
}

watch([input], highlight, { flush: 'post' })

onMounted(async () => {
  if (!editorEl.value || !textAreaEl.value)
    return
  await init()
  container = editorEl.value.querySelector('pre')
  lineNumbers = editorEl.value.querySelector('.line-numbers')
  const info = resolveCodeInfo(editorEl.value)
  lang.value = info.lang
  input.value = info.code
  textAreaEl.value.addEventListener('scroll', updateScroll, { passive: false })
  window.addEventListener('resize', updateScroll)
})

onUnmounted(() => {
  textAreaEl.value?.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', updateScroll)
  highlighter = null
  container = null
  lineNumbers = null
})
</script>

<template>
  <div ref="editorEl" class="code-repl-editor">
    <slot />
    <textarea ref="textAreaEl" v-model="input" class="code-repl-input" />
  </div>
</template>

<style scoped>
.code-repl-editor {
  position: relative;
}

.code-repl-editor :deep(div[class*="language-"] pre) {
  scrollbar-width: none;
}

.code-repl-editor:hover :deep(.copy-code-button) {
  opacity: 1;
}

.code-repl-input {
  position: absolute;
  top: 0;
  right: -1.5rem;
  bottom: 0;
  left: -1.5rem;
  z-index: 1;
  box-sizing: border-box;
  display: block;
  padding: 20px 24px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
  -webkit-hyphens: none;
  hyphens: none;
  line-height: var(--vp-code-line-height);
  color: transparent;
  text-align: left;
  word-break: normal;
  word-wrap: normal;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  white-space: pre;
  caret-color: gray;
  resize: none;
  background-color: transparent;
  word-spacing: normal;

  direction: ltr;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  scrollbar-width: thin;
}

@media (min-width: 640px) {
  .code-repl-input {
    right: 0;
    left: 0;
  }
}

:deep(div[class*="language-"].line-numbers-mode) + .code-repl-input {
  padding-left: 24px;
  margin-left: 32px;
}
</style>
