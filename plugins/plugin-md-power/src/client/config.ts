import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { pluginOptions } from './options.js'
import { setupCanIUse } from './composables/setupCanIUse.js'
import PDFViewer from './components/PDFViewer.vue'
import Bilibili from './components/Bilibili.vue'
import Youtube from './components/Youtube.vue'
import Replit from './components/Replit.vue'
import CodeSandbox from './components/CodeSandbox.vue'

import '@internal/md-power/icons.css'

declare const __VUEPRESS_SSR__: boolean

export default defineClientConfig({
  enhance({ router, app }) {
    if (pluginOptions.pdf)
      app.component('PDFViewer', PDFViewer)

    if (pluginOptions.bilibili)
      app.component('VideoBilibili', Bilibili)

    if (pluginOptions.youtube)
      app.component('VideoYoutube', Youtube)

    if (pluginOptions.replit)
      app.component('ReplitViewer', Replit)

    if (pluginOptions.codeSandbox)
      app.component('CodeSandboxViewer', CodeSandbox)

    if (__VUEPRESS_SSR__)
      return

    if (pluginOptions.caniuse) {
      router.afterEach(() => {
        setupCanIUse()
      })
    }
  },
}) as ClientConfig
