import type { ClientConfig } from 'vuepress/client'
import { defineClientConfig } from 'vuepress/client'
import { Content } from './components/Content.js'

export default defineClientConfig({
  enhance({ app }) {
    if (app._context.components.Content)
      delete app._context.components.Content

    app.component('Content', Content)
  },
}) as ClientConfig
