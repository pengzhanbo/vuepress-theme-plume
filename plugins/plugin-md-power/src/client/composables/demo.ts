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
): { id: string, height: Ref<string> } {
  const current = getCurrentInstance()
  const id = useId()
  const isDark = computed(() => current?.appContext.config.globalProperties.$isDark.value)
  const height = ref('100px')

  onMounted(() => {
    if (!draw.value)
      return
    const iframeDoc = draw.value.contentDocument || draw.value.contentWindow?.document

    if (!iframeDoc)
      return

    const templateId = `VPDemoNormalDraw${id}`
    useEventListener('message', (event) => {
      const data = parseData(event.data)
      if (data.type === templateId) {
        height.value = `${data.height + 5}px`
      }
    })
    watch([config, title], () => {
      iframeDoc.write(createHTMLTemplate(toValue(title) || 'Demo', templateId, toValue(config)))
    }, { immediate: true })

    watch(isDark, () => {
      iframeDoc.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
    }, { immediate: true })
  })

  return { id, height }
}

function createHTMLTemplate(title: string, id: string, config?: DemoConfig): string {
  const { cssLib = [], jsLib = [], html, css, script } = config || {}
  const stylesheet = cssLib.map(url => `<link rel="stylesheet" href="${url}">`).join('')
  const scripts = jsLib.map(url => `<script src="${url}"></script>`).join('')
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${title}</title>
    ${stylesheet}${scripts}
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>;(function(){${script}})();</script>
    <script>;(function(){
  const height = Math.ceil(document.documentElement.getBoundingClientRect().height)
  window.parent?.postMessage({ type: '${id}', height }, '*')
  if (typeof window.ResizeObserver === 'undefined')
    return
  const resizeObserver = new ResizeObserver(entries => {
    const height = Math.ceil(document.documentElement.getBoundingClientRect().height)
    window.parent?.postMessage({ type: '${id}', height }, '*')
  })
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
