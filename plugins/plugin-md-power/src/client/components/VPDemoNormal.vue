<script setup lang="ts">
import { onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { loadScript, loadStyle } from '../utils/shared.js'

import '../styles/demo.css'

const props = defineProps<{
  title?: string
  desc?: string
  expanded?: boolean
  config?: {
    html: string
    css: string
    script: string
    jsLib: string[]
    cssLib: string[]
  }
}>()

const draw = useTemplateRef<HTMLDivElement>('draw')
const id = useId()

onMounted(() => {
  if (!draw.value)
    return
  const root = draw.value.attachShadow({ mode: 'open' })

  watch(() => props.config, async () => {
    root.innerHTML = props.config?.html ?? ''

    props.config?.cssLib?.forEach(url => loadStyle(url, root))
    if (props.config?.css) {
      const style = document.createElement('style')
      style.innerHTML = props.config?.css ?? ''
      root.appendChild(style)
    }

    if (props.config?.jsLib?.length) {
      await Promise.all(props.config.jsLib.map(url => loadScript(url)))
        .catch(e => console.warn(e))
    }

    if (props.config?.script) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.innerHTML = `;(function(document){\n${props.config.script}\n})(document.querySelector('#VPDemoNormalDraw${id}').shadowRoot);`
      root.appendChild(script)
    }
  }, { immediate: true })
})

const fence = useTemplateRef<HTMLDivElement>('fence')
const data = ref<{
  js: string
  css: string
  html: string
  jsType: string
  cssType: string
}>({ js: '', css: '', html: '', jsType: '', cssType: '' })

onMounted(() => {
  if (!fence.value)
    return

  data.value.html = props.config?.html ?? ''
  const els = Array.from(fence.value.querySelectorAll('div[class*="language-"]'))
  for (const el of els) {
    const lang = el.className.match(/language-(\w+)/)?.[1] ?? ''
    const content = (el.querySelector('pre')?.textContent ?? '')
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

const showCode = ref(props.expanded ?? false)
function toggleCode() {
  showCode.value = !showCode.value
}
</script>

<template>
  <div class="vp-demo-wrapper normal">
    <div class="demo-draw">
      <div :id="`VPDemoNormalDraw${id}`" ref="draw" />
    </div>
    <div v-if="title || desc" class="demo-info">
      <p v-if="title" class="title">
        {{ title }}
      </p>
      <p v-if="desc" class="desc">
        {{ desc }}
      </p>
    </div>
    <div class="demo-ctrl">
      <div class="extra">
        <form action="https://codepen.io/pen/define" method="POST" target="_blank">
          <input
            type="hidden" name="data" :value="JSON.stringify({
              title: title || 'Demo',
              description: desc || '',
              html: data.html,
              css: data.css,
              js: data.js,
              js_pre_processor: data.jsType === 'ts' ? 'typescript' : 'none',
              css_pre_processor: data.cssType,
              css_external: config?.cssLib?.join(';'),
              js_external: config?.jsLib?.join(';'),
            })"
          >
          <button type="submit" title="CodePen" aria-label="CodePen">
            <span class="vpi-demo-codepen" />
          </button>
        </form>
        <form action="https://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">
          <button type="submit" title="jsFiddle" aria-label="jsFiddle">
            <span class="vpi-demo-jsfiddle bg" />
          </button>
          <input type="hidden" name="wrap" value="b">
          <input type="hidden" name="html" :value="data.html">
          <input type="hidden" name="js" :value="data.js">
          <input type="hidden" name="css" :value="data.cssType === 'scss' || data.cssType === 'css' ? data.css : config?.css || ''">
          <input type="hidden" name="panel_css" :value="data.cssType === 'scss' ? 1 : 0">
          <input type="hidden" name="panel_js" :value="data.jsType === 'ts' ? 4 : 0">
          <input type="hidden" name="title" :value="title || 'Demo'">
          <input type="hidden" name="description" :value="desc || ''">
          <input type="hidden" name="resources" :value="[...(config?.jsLib || []), ...(config?.cssLib || [])].join(',')">
        </form>
      </div>
      <span class="vpi-demo-code" @click="toggleCode" />
    </div>
    <div v-show="showCode" ref="fence" class="demo-code">
      <slot />
    </div>
  </div>
</template>
