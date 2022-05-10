import { defineClientAppEnhance } from '@vuepress/client'
import Collection from './components/PageCollection'

export default defineClientAppEnhance(({ app }) => {
  app.component('PageCollection', Collection)
})
