import { defineClientConfig } from '@vuepress/client'
import Collection from './components/PageCollection'

export default defineClientConfig({
  enhance({ app }) {
    // eslint-disable-next-line vue/match-component-file-name
    app.component('PageCollection', Collection)
  },
})
