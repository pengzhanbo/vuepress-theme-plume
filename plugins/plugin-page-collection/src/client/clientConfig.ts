import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import Collection from './components/PageCollection.js'

export default defineClientConfig({
  enhance({ app }) {
    app.component('PageCollection', Collection)
  },
}) as ClientConfig
