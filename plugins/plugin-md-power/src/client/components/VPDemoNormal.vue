<script setup lang="ts">
import type { DemoConfig } from '../composables/demo.js'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { useTemplateRef } from 'vue'
import { useExpand, useFence, useNormalDemo, useResources } from '../composables/demo.js'

import '@vuepress/helper/transition/fade-in.css'
import '@vuepress/helper/transition/fade-in-height-expand.css'
import '../styles/demo.css'

const props = defineProps<{
  title?: string
  desc?: string
  expanded?: boolean
  config?: DemoConfig
}>()

const [showCode, toggleCode] = useExpand(props.expanded)

const { resources, showResources, toggleResources } = useResources(
  useTemplateRef<HTMLDivElement>('resourcesEl'),
  () => props.config,
)

const { id, height } = useNormalDemo(
  useTemplateRef<HTMLIFrameElement>('draw'),
  () => props.title,
  () => props.config,
)

const data = useFence(
  useTemplateRef<HTMLDivElement>('fence'),
  () => props.config,
)
</script>

<template>
  <div class="vp-demo-wrapper normal">
    <div class="demo-draw">
      <iframe
        :id="`VPDemoNormalDraw${id}`"
        ref="draw"
        :title="title || 'Demo'"
        class="draw-iframe"
        allow="accelerometer *; bluetooth *; camera *; encrypted-media *; display-capture *; geolocation *; gyroscope *; microphone *; midi *; clipboard-read *; clipboard-write *; web-share *; serial *; xr-spatial-tracking *"
        allowfullscreen="true"
        allowpaymentrequest="true"
        allowtransparency="true"
        sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups-to-escape-sandbox allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation" :style="{ height }"
      />
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
        <form action="https://codepen.io/pen/define" method="POST" target="_blank" enctype="application/x-www-form-urlencoded;charset=utf-8">
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
        <form action="https://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank" enctype="application/x-www-form-urlencoded;charset=UTF-8" accept-charset="UTF-8">
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
      <div v-if="resources.length" class="demo-resources">
        <span ref="resourcesEl" class="vpi-demo-resources" title="Resources" aria-label="Resources" @click="toggleResources" />
        <Transition name="fade-in">
          <div v-show="showResources" class="demo-resources-container">
            <div v-for="{ name, items } in resources" :key="name" class="demo-resources-list">
              <p>{{ name }}</p>
              <ul v-for="item in items" :key="item.url">
                <li>
                  <a :href="item.url" target="_blank" rel="noopener noreferrer" class="no-icon" aria-label="{{ item.name }}">{{ item.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
      <button type="button" aria-label="Toggle Code" @click="toggleCode">
        <span class="vpi-demo-code" />
      </button>
    </div>
    <FadeInExpandTransition>
      <div v-show="showCode" ref="fence" class="demo-code">
        <slot />
      </div>
    </FadeInExpandTransition>
  </div>
</template>
