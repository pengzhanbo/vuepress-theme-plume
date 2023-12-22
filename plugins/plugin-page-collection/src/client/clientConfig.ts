import { defineClientConfig } from '@vuepress/client'
import Collection from './components/PageCollection.js'

export default defineClientConfig({
  enhance({ app }) {
    // eslint-disable-next-line vue/match-component-file-name
    app.component('PageCollection', Collection)
  },
})
