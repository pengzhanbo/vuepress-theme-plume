import { defineClientAppEnhance } from '@vuepress/client'
import Collection from './components/PageCollection'

export default defineClientAppEnhance(({ app }) => {
  // 注入全局插件
  app.component('PageCollection', Collection)
})
