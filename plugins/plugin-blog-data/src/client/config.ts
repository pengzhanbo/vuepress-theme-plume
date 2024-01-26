import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { useBlogPostData } from './composables/index.js'

declare const __VUE_PROD_DEVTOOLS__: boolean

export default defineClientConfig({
  enhance({ app }) {
    const blogPostData = useBlogPostData()

    Object.defineProperties(app.config.globalProperties, {
      $blogPostData: {
        get() {
          return blogPostData.value
        },
      },
    })

    // setup devtools in dev mode
    if (__VUEPRESS_DEV__ || __VUE_PROD_DEVTOOLS__) {
      const PLUGIN_ID = 'org.vuejs.vuepress'
      const PLUGIN_LABEL = 'VuePress'
      const INSPECTOR_ID = PLUGIN_ID

      setupDevtoolsPlugin(
        {
          // fix recursive reference
          app: app as any,
          id: PLUGIN_ID,
          label: PLUGIN_LABEL,
          packageName: '@vuepress-plume/plugin-blog-data',
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
          api.on.getInspectorTree((payload) => {
            if (payload.inspectorId !== INSPECTOR_ID)
              return
            payload.rootNodes.push({
              id: 'blog_post_data',
              label: 'Blog Post Data',
            })
          })
          api.on.getInspectorState((payload) => {
            if (payload.inspectorId !== INSPECTOR_ID)
              return
            if (payload.nodeId === 'blog_post_data') {
              payload.state = {
                BlogPostData: [{
                  key: 'blogPostData',
                  value: blogPostData.value,
                }],
              }
            }
          })
        },
      )
    }
  },
}) as ClientConfig
