<script setup lang="ts">
import { onClickOutside, useClipboard, useToggle } from '@vueuse/core'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { withBase } from 'vuepress/client'
import { useData, useEncrypt } from '../../composables/index.js'

import '@vuepress/helper/transition/fade-in.css'

interface MenuItem {
  link: string
  text: string
  tagline: string
  icon: string
  type?: string
}

const { claude = true, chatgpt = true, perplexity = true } = defineProps<{
  /**
   * Claude AI
   * @see https://claude.ai/new
   */
  claude?: boolean
  /**
   * Chat GPT
   * @see https://chat.openai.com
   */
  chatgpt?: boolean
  /**
   * Perplexity
   * @see https://perplexity.ai/
   */
  perplexity?: boolean
}>()

const { page, frontmatter, theme } = useData()
const { isPageDecrypted } = useEncrypt()

const markdownLink = computed(() => {
  const url = withBase(page.value.path)
  if (url.endsWith('.html'))
    return `${url.slice(0, -5)}.md`
  if (url[url.length - 1] !== '/')
    return `${url}.md`
  return `${url}index.md`
})

const message = computed(() => {
  if (__VUEPRESS_SSR__) {
    return ''
  }
  return encodeURIComponent(
    (theme.value.askAIMessage ?? 'Read {link} and answer content-related questions.')
      .replace('{link}', location.origin + markdownLink.value),
  )
})

const menuList = computed(() => {
  const list: MenuItem[] = []

  list.push({
    link: markdownLink.value,
    text: theme.value.viewMarkdown ?? 'View as Markdown',
    tagline: theme.value.viewMarkdownTagline ?? 'View this page as plain text',
    icon: 'vpi-markdown',
    type: 'text/markdown',
  })

  if (chatgpt) {
    list.push({
      link: `https://chat.openai.com/?prompt=${message.value}`,
      text: (theme.value.askAIText ?? 'Open in {name}').replace('{name}', 'ChatGPT'),
      tagline: (theme.value.askAITagline ?? 'Ask {name} about this page').replace('{name}', 'ChatGPT'),
      icon: 'vpi-chatgpt',
    })
  }

  if (claude) {
    list.push({
      link: `https://claude.ai/new?q=${message.value}`,
      text: (theme.value.askAIText ?? 'Open in {name}').replace('{name}', 'Claude'),
      tagline: (theme.value.askAITagline ?? 'Ask {name} about this page').replace('{name}', 'Claude'),
      icon: 'vpi-claude',
    })
  }

  if (perplexity) {
    list.push({
      link: `https://perplexity.ai/?q=${message.value}`,
      text: (theme.value.askAIText ?? 'Open in {name}').replace('{name}', 'Perplexity'),
      tagline: (theme.value.askAITagline ?? 'Ask {name} about this page').replace('{name}', 'Perplexity'),
      icon: 'vpi-perplexity',
    })
  }

  return list
})

const markdownContent = ref('')
const loaded = ref(true)
const { copy, copied } = useClipboard()

async function onCopy() {
  if (!markdownContent.value) {
    loaded.value = false
    await fetchMarkdownContent()
    loaded.value = true
  }
  markdownContent.value && copy(markdownContent.value)
}

let promise: Promise<void> | null = null
async function fetchMarkdownContent() {
  if (promise)
    return
  promise = fetch(location.origin + markdownLink.value)
    .then(res => res.text())
    .then((text) => {
      markdownContent.value = text.trimStart().replace(/^---[\s\S]+?---/, '').trimStart()
    })
    .finally(() => {
      promise = null
    })
  await promise
}

onMounted(() => {
  const idl = window.requestIdleCallback || window.requestAnimationFrame || (cb => setTimeout(cb, 0))
  idl(fetchMarkdownContent)
})

const menuRef = useTemplateRef('menu')
const toggleRef = useTemplateRef('toggle')
const [open, toggleMenu] = useToggle(false)
onClickOutside(menuRef, () => toggleMenu(false), { ignore: [toggleRef] })

const copyPageText = computed(() => {
  const copyText = theme.value.copyPageText ?? 'Copy page'
  const copiedText = theme.value.copiedPageText ?? 'Copied !'
  const copyingText = theme.value.copingPageText ?? 'Copying..'
  return copied.value ? copiedText : !loaded.value ? copyingText : copyText
})
</script>

<template>
  <div v-if="frontmatter.llmstxt !== false && isPageDecrypted" class="vp-page-context-menu">
    <div class="page-context-button" type="button">
      <span class="page-context-copy" @click="onCopy">
        <span class="vpi-copy" :class="{ loading: !loaded, copied }" />
        <span class="text">{{ copyPageText }}</span>
      </span>
      <span ref="toggle" class="page-context-toggle" :class="{ open }" @click="() => toggleMenu()">
        <span class="vpi-chevron-down" />
      </span>
    </div>
    <Transition name="fade-in">
      <ul v-show="open" ref="menu" class="page-context-menu">
        <li>
          <a href="javascript:void(0)" @click="onCopy">
            <span class="vpi-copy" :class="{ loading: !loaded, copied }" />
            <span>
              {{ copyPageText }}
              <small>{{ theme.copyTagline ?? 'Copy page as Markdown for LLMs' }}</small>
            </span>
          </a>
        </li>
        <li v-for="item in menuList" :key="item.text">
          <a
            :href="item.link" target="_blank" rel="noopener noreferrer"
            :aria-label="item.text" :type="item.type"
            data-allow-mismatch
          >
            <span :class="item.icon" />
            <span>
              {{ item.text }} <span class="vpi-external-link" />
              <small>{{ item.tagline }}</small>
            </span>
          </a>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.vp-page-context-menu {
  position: relative;
  display: inline-block;
  align-self: flex-start;
  width: fit-content;
}

.page-context-button {
  height: 32px;
  overflow: hidden;
  border: solid 1px var(--vp-c-divider);
  border-radius: 6px;
}

.page-context-button,
.page-context-copy {
  display: flex;
  align-items: center;
}

.page-context-copy {
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
}

.page-context-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  border-left: solid 1px var(--vp-c-divider);
}

.page-context-toggle {
  color: var(--vp-c-text-3);
}

.page-context-copy,
.page-context-toggle {
  height: 30px;
  cursor: pointer;
  background-color: transparent;
  transition: background-color var(--vp-t-color);
}

.page-context-copy:hover,
.page-context-toggle:hover,
.page-context-toggle.open {
  background-color: var(--vp-c-bg-soft);
}

.page-context-copy .text {
  flex: 1;
  text-align: center;
}

.page-context-toggle .vpi-chevron-down {
  transition: transform var(--vp-t-color);
}

.page-context-toggle.open .vpi-chevron-down {
  transform: rotate(270deg);
}

.vpi-copy {
  --icon: var(--code-copy-icon);
}

.vpi-copy.copied {
  --icon: var(--code-copied-icon);
}

.vpi-copy.loading {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-dasharray='16' stroke-dashoffset='16' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 3c4.97 0 9 4.03 9 9'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' dur='0.2s' values='16;0'/%3E%3CanimateTransform attributeName='transform' dur='1.5s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/path%3E%3C/svg%3E");
}

.page-context-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 20;
  width: max-content;
  padding: 8px 4px;
  list-style: none;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-radius: 6px;
  box-shadow: var(--vp-shadow-2);
}

@media (min-width: 768px) {
  .page-context-menu {
    right: 0;
    left: unset;
  }
}

.page-context-menu li a {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: bold;
  color: var(--vp-c-text-1);
  cursor: pointer;
  background-color: transparent;
  border-radius: 6px;
  transition: background-color var(--vp-t-color);
}

.page-context-menu li a:hover {
  background-color: var(--vp-c-bg-soft);
}

.page-context-menu li a > [class*="vpi-"] {
  display: inline-block;
  width: 24px;
  height: 24px;
  overflow: hidden;
  color: var(--vp-c-text-2);
  border: solid 1px var(--vp-c-divider);
  border-radius: 4px;
}

.page-context-menu li a small {
  display: block;
  font-size: 12px;
  font-weight: normal;
  color: var(--vp-c-text-3);
}

.page-context-menu .vpi-external-link {
  color: var(--vp-c-text-3);
}

.vpi-markdown {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41M6.81 15.19v-3.66l1.92 2.35l1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35l-1.92-2.35H4.89v6.38zM19.69 12h-1.92V8.81h-1.92V12h-1.93l2.89 3.28z'/%3E%3C/svg%3E");
}

.vpi-chatgpt {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 2a4 4 0 0 1 3.46 1.99l.098.182l.638-.368a4 4 0 0 1 5.475 5.446l-.113.186l.638.368a4 4 0 0 1-1.979 7.464L18 17.264V18a4 4 0 0 1-7.459 2.01l-.1-.182l-.637.368a4 4 0 0 1-5.475-5.446l.113-.186l-.638-.368a4 4 0 0 1 1.979-7.464L6 6.736V6a4 4 0 0 1 4-4m4.702 10.788l-.068 4.059a1 1 0 0 1-.391.777l-.109.072l-1.956 1.13a2.002 2.002 0 0 0 3.817-.677L16 18v-4.434l-1.298-.779Zm-2.033 1.946l-3.55 1.97a1 1 0 0 1-.985-.008l-1.956-1.13a2.001 2.001 0 0 0 2.626 2.898l3.84-2.217zm2.687-5.415l-1.323.735l3.482 2.089A1 1 0 0 1 18 13v2.259a2.002 2.002 0 0 0 1.196-3.723zM6 8.74a2.001 2.001 0 0 0-1.328 3.64l.132.083l3.84 2.217l1.323-.735l-3.482-2.088a1 1 0 0 1-.477-.728L6 11zM10 4a2 2 0 0 0-2 2v4.434l1.298.779l.068-4.06a1 1 0 0 1 .5-.85l1.956-1.129A2 2 0 0 0 10 4m7.928 2.268a2 2 0 0 0-2.594-.805l-.138.073l-3.84 2.217l-.025 1.513l3.55-1.97a1 1 0 0 1 .868-.05l.117.058l1.957 1.13c.442-.62.51-1.465.105-2.166'/%3E%3C/g%3E%3C/svg%3E");
}

.vpi-claude {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m5.92 15.3l3.94-2.2l.06-.2l-.06-.1h-.2L9 12.76l-2.24-.06l-1.96-.1l-1.9-.1l-.48-.1l-.42-.6l.04-.3l.4-.26l.58.04l1.26.1l1.9.12l1.38.08l2.04.24h.32l.04-.14l-.1-.08l-.08-.08L7.8 10.2L5.68 8.8l-1.12-.82l-.6-.4l-.3-.4l-.12-.84l.54-.6l.74.06l.18.04l.74.58l1.6 1.22L9.4 9.2l.3.24l.12-.08l.02-.06l-.14-.22L8.6 7L7.4 4.92l-.54-.86l-.14-.52c-.06-.2-.08-.4-.08-.6l.6-.84l.36-.1l.84.12l.32.28l.52 1.2l.82 1.86l1.3 2.52l.4.76l.2.68l.06.2h.14v-.1l.1-1.44l.2-1.74l.2-2.24l.06-.64l.32-.76l.6-.4l.52.22l.4.58l-.06.36L14.32 5l-.52 2.42l-.3 1.64h.18l.2-.22l.82-1.08l1.38-1.72l.6-.7l.72-.74l.46-.36h.86l.62.94l-.28.98l-.88 1.12l-.74.94l-1.06 1.42l-.64 1.14l.06.08h.14l2.4-.52l1.28-.22l1.52-.26l.7.32l.08.32l-.28.68l-1.64.4l-1.92.4l-2.86.66l-.04.02l.04.06l1.28.12l.56.04h1.36l2.52.2l.66.4l.38.54l-.06.4l-1.02.52l-1.36-.32l-3.2-.76l-1.08-.26h-.16v.08l.92.9l1.66 1.5l2.12 1.94l.1.48l-.26.4l-.28-.04l-1.84-1.4l-.72-.6l-1.6-1.36h-.1v.14l.36.54l1.96 2.94l.1.9l-.14.28l-.52.2l-.54-.12l-1.16-1.6l-1.2-1.8l-.94-1.64l-.1.08l-.58 6.04l-.26.3l-.6.24l-.5-.4l-.28-.6l.28-1.24l.32-1.6l.26-1.28l.24-1.58l.14-.52v-.04h-.14l-1.2 1.66l-1.8 2.46l-1.44 1.52l-.34.14l-.6-.3l.06-.56l.32-.46l2-2.56l1.2-1.58l.8-.92l-.02-.1h-.06l-5.28 3.44l-.94.12l-.4-.4l.04-.6l.2-.2l1.6-1.1z'/%3E%3C/svg%3E");
}

.vpi-perplexity {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7.173 3.26L5.5 1.74V7.5H3V17h2.5v5.26l1.673-1.52L11 17.26V22h2v-4.74l3.827 3.48l1.673 1.52V17H21V7.5h-2.5V1.74l-1.673 1.52L13 6.74V2h-2v4.74zM16.5 7.5h-1.363L16.5 6.26zm-7.637 0H7.5V6.26zm1.1 2l-4.136 3.76l-.327.298V15H5V9.5zm4.074 0H19V15h-.5v-1.442l-.327-.298zM7.5 14.442l3.5-3.181v3.297L7.5 17.74zm5.5-3.181l3.5 3.181v3.297L13 14.558z'/%3E%3C/svg%3E");
}
</style>
