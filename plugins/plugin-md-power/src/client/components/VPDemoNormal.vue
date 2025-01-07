<script setup lang="ts">
import { onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { loadScript, loadStyle } from '../utils/shared.js'

import '../styles/demo.css'

const props = defineProps<{
  title?: string
  desc?: string
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

const showCode = ref(false)
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
      <span class="vpi-demo-code" @click="toggleCode" />
    </div>
    <div v-show="showCode" class="demo-code">
      <slot />
    </div>
  </div>
</template>
