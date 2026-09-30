import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { computed, getCurrentInstance, onMounted, ref, toValue, useId, watch } from 'vue'
import { isPlainObject } from 'vuepress/shared'

export interface DemoConfig {
  html: string
  css: string
  script: string
  jsLib: string[]
  cssLib: string[]
}

export function useExpand(defaultExpand = true): readonly [Ref<boolean>, () => void] {
  const expanded = ref(defaultExpand)
  function toggle() {
    expanded.value = !expanded.value
  }
  return [expanded, toggle] as const
}

interface ResourceItem {
  name: string
  items: SubResourceItem[]
}

interface SubResourceItem {
  name: string
  url: string
}

interface UseResourcesResult {
  resources: ComputedRef<ResourceItem[]>
  showResources: Ref<boolean>
  toggleResources: () => void
}

export function useResources(el: ShallowRef<HTMLDivElement | null>, config: MaybeRefOrGetter<DemoConfig | undefined>): UseResourcesResult {
  const resources = computed<ResourceItem[]>(() => {
    const conf = toValue(config)
    if (!conf)
      return []
    return [
      { name: 'JavaScript', items: conf.jsLib?.map(url => ({ name: normalizeName(url), url })) },
      { name: 'CSS', items: conf.cssLib?.map(url => ({ name: normalizeName(url), url })) },
    ].filter(i => i.items?.length)
  })

  function normalizeName(url: string) {
    return url.slice(url.lastIndexOf('/') + 1)
  }

  const showResources = ref(false)

  function toggleResources(): void {
    showResources.value = !showResources.value
  }

  onClickOutside(el, () => {
    showResources.value = false
  })

  return {
    resources,
    showResources,
    toggleResources,
  }
}

interface FenceData {
  js: string
  css: string
  html: string
  jsType: string
  cssType: string
}

export function useFence(fence: ShallowRef<HTMLDivElement | null>, config: MaybeRefOrGetter<DemoConfig | undefined>): Ref<FenceData> {
  const data = ref<FenceData>({ js: '', css: '', html: '', jsType: '', cssType: '' })

  onMounted(() => {
    if (!fence.value)
      return
    const conf = toValue(config)
    data.value.html = conf?.html ?? ''
    const els = Array.from(fence.value.querySelectorAll('div[class*="language-"]'))
    for (const el of els) {
      const lang = el.className.match(/language-(\w+)/)?.[1] ?? ''
      const content = el.querySelector('pre')?.textContent ?? ''
      if (lang === 'js' || lang === 'javascript') {
        data.value.js = content
        data.value.jsType = 'js'
      }
      if (lang === 'ts' || lang === 'typescript') {
        data.value.js = content
        data.value.jsType = 'ts'
      }
      if (lang === 'css' || lang === 'scss' || lang === 'less' || lang === 'stylus' || lang === 'styl') {
        data.value.css = content
        data.value.cssType = lang === 'styl' ? 'stylus' : lang
      }
    }
  })
  return data
}

export function useNormalDemo(
  draw: ShallowRef<HTMLIFrameElement | null>,
  title: MaybeRefOrGetter<string | undefined>,
  config: MaybeRefOrGetter<DemoConfig | undefined>,
): { id: string, height: Ref<string>, html: Ref<string>, syncTheme: () => void } {
  const current = getCurrentInstance()
  const id = useId()
  const isDark = computed<boolean>(() => current?.appContext.config.globalProperties.$isDark?.value ?? false)
  const height = ref('100px')
  const templateId = `VPDemoNormalDraw${id}`

  // 使用 `srcdoc` 注入内容，避免在 `sandbox` 缺少 `allow-same-origin` 时无法访问 iframe 文档。
  // Use `srcdoc` to inject the content, so that the iframe document stays accessible
  // even though the `sandbox` does not grant `allow-same-origin`.
  const html = ref('')
  watch([config, title], () => {
    html.value = createHTMLTemplate(toValue(title) || 'Demo', templateId, toValue(config), isDark.value ? 'dark' : 'light')
  }, { immediate: true })

  // 沙箱与父页面不同源，主题只能通过 `postMessage` 同步。
  // The sandbox has an opaque origin, so the theme can only be synced via `postMessage`.
  function syncTheme(): void {
    draw.value?.contentWindow?.postMessage({
      type: `${templateId}-theme`,
      theme: isDark.value ? 'dark' : 'light',
    }, '*')
  }

  watch(isDark, syncTheme)

  onMounted(() => {
    useEventListener('message', (event: MessageEvent) => {
      // 仅接受来自当前 iframe 的消息，防止其他窗口伪造高度。
      // Only accept messages from the current iframe to prevent forged heights.
      if (event.source !== draw.value?.contentWindow)
        return
      const data = parseData(event.data)
      if (data.type === templateId && typeof data.height === 'number') {
        height.value = `${data.height + 5}px`
      }
    })
  })

  return { id, height, html, syncTheme }
}

const RESOURCE_PROTOCOLS: readonly string[] = ['http:', 'https:']

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => HTML_ESCAPE[char])
}

/**
 * 校验资源 URL 是否属于 `http`/`https` 协议，拒绝 `javascript:`、`data:` 等危险协议。
 *
 * Validate that a resource URL uses the `http`/`https` protocol,
 * rejecting dangerous protocols such as `javascript:` and `data:`.
 */
function isSafeResourceUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.trim() === '')
    return false
  try {
    return RESOURCE_PROTOCOLS.includes(new URL(url, 'http://a.com').protocol)
  }
  catch {
    return false
  }
}

function createHTMLTemplate(title: string, id: string, config?: DemoConfig, theme: 'dark' | 'light' = 'light'): string {
  const { cssLib = [], jsLib = [], html, css, script } = config || {}
  const stylesheet = cssLib.filter(isSafeResourceUrl).map(url => `<link rel="stylesheet" href="${escapeHtml(url)}">`).join('')
  const scripts = jsLib.filter(isSafeResourceUrl).map(url => `<script src="${escapeHtml(url)}"></script>`).join('')
  const typeId = JSON.stringify(id)
  const themeId = JSON.stringify(`${id}-theme`)
  return `<!DOCTYPE html>
<html data-theme="${theme}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
    ${stylesheet}${scripts}
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>;(function(){${script}})();</script>
    <script>;(function(){
  window.addEventListener('message', function (event) {
    var data = event.data
    if (event.source !== window.parent || !data || data.type !== ${themeId} || (data.theme !== 'dark' && data.theme !== 'light'))
      return
    document.documentElement.dataset.theme = data.theme
  })
  function postHeight() {
    var height = Math.ceil(document.documentElement.getBoundingClientRect().height)
    window.parent?.postMessage({ type: ${typeId}, height }, '*')
  }
  postHeight()
  if (typeof window.ResizeObserver === 'undefined')
    return
  var resizeObserver = new ResizeObserver(postHeight)
  resizeObserver.observe(document.documentElement)
})();</script>
  </body>
</html>`
}

export function parseData(data: any): any {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data)
    }
    else if (isPlainObject(data)) {
      return data
    }
    return {}
  }
  catch {
    return {}
  }
}
