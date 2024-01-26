import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { useNotesData } from './composables/index.js'

declare const __VUE_PROD_DEVTOOLS__: boolean

export default defineClientConfig({
  enhance({ app }) {
    const notesData = useNotesData()

    Object.defineProperties(app.config.globalProperties, {
      $notesData: {
        get() {
          return notesData.value
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
          packageName: '@vuepress-plume/plugin-notes-data',
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
          api.on.getInspectorTree((payload) => {
            if (payload.inspectorId !== INSPECTOR_ID)
              return
            payload.rootNodes.push({
              id: 'notes_data',
              label: 'Notes Data',
            })
          })
          api.on.getInspectorState((payload) => {
            if (payload.inspectorId !== INSPECTOR_ID)
              return
            if (payload.nodeId === 'notes_data') {
              payload.state = {
                NotesData: [{
                  key: 'notesData',
                  value: notesData.value,
                }],
              }
            }
          })
        },
      )
    }
  },
}) as ClientConfig
