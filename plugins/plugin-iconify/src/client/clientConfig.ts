import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import Iconify from './components/Iconify.vue'

declare const __VUEPRESS_PLUGIN_ICONIFY_COMPONENT_NAME__: string
export default defineClientConfig({
  enhance({ app }) {
    const name = __VUEPRESS_PLUGIN_ICONIFY_COMPONENT_NAME__ || 'Iconify'
    app.component(name, Iconify)
  },
}) as ClientConfig
