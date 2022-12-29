import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { defineClientConfig } from '@vuepress/client'
import { useBlogPostData } from './composables/index.js'

declare const __VUE_PROD_DEVTOOLS__: boolean

export default defineClientConfig({
  enhance({ app }) {
    const blogPostData = useBlogPostData()

    // setup devtools in dev mode
    if (__VUEPRESS_DEV__ || __VUE_PROD_DEVTOOLS__) {
      setupDevtoolsPlugin(
        {
          // fix recursive reference
          app: app as any,
          id: 'org.vuepress-plume.plugin-blog-data',
          label: 'VuePress Blog Data Plugin',
          packageName: '@vuepress/plugin-blog-data',
          homepage: 'https://pengzhanbo.cn',
          logo: 'https://v2.vuepress.vuejs.org/images/hero.png',
          componentStateTypes: ['VuePress'],
        },
        (api) => {
          api.on.inspectComponent((payload) => {
            payload.instanceData.state.push({
              type: 'VuePress',
              key: 'blogPostData',
              editable: false,
              value: blogPostData.value,
            })
          })
        }
      )
    }
  },
})
