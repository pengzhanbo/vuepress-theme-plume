import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { defineClientConfig } from '@vuepress/client'
import { useNotesData } from './composables/index.js'

declare const __VUE_PROD_DEVTOOLS__: boolean

export default defineClientConfig({
  enhance({ app }) {
    const notesData = useNotesData()

    // setup devtools in dev mode
    if (__VUEPRESS_DEV__ || __VUE_PROD_DEVTOOLS__) {
      setupDevtoolsPlugin(
        {
          // fix recursive reference
          app: app as any,
          id: 'org.vuepress-plume.plugin-notes-data',
          label: 'VuePress Notes Data Plugin',
          packageName: '@vuepress/plugin-notes-data',
          homepage: 'https://pengzhanbo.cn',
          logo: 'https://v2.vuepress.vuejs.org/images/hero.png',
          componentStateTypes: ['VuePress'],
        },
        (api) => {
          api.on.inspectComponent((payload) => {
            payload.instanceData.state.push({
              type: 'VuePress',
              key: 'notesData',
              editable: false,
              value: notesData.value,
            })
          })
        },
      )
    }
  },
})
