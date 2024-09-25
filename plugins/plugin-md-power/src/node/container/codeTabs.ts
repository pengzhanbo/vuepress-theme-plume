import type { PluginSimple } from 'markdown-it'
import { tab } from '@mdit/plugin-tab'
import { getFileIconName } from '../fileIcons/index.js'
import { stringifyProp } from '../utils/stringifyProp.js'

export const codeTabs: PluginSimple = (md) => {
  tab(md, {
    name: 'code-tabs',

    tabsOpenRenderer: ({ active, data }, tokens, index) => {
      const { meta } = tokens[index]
      const titles = data.map(({ title }) => md.renderInline(title))
      const tabsData = data.map((item, dataIndex) => {
        const { id = titles[dataIndex] } = item

        return { id }
      })

      const titlesContent = titles.map((title, index) => {
        const icon = getFileIconName(title)
        return `<template #title${index}="{ value, isActive }">${icon ? `<VPIcon name="${icon}"/>` : ''}<span>${title}</span></template>`
      }).join('')

      return `<CodeTabs id="${index}" :data='${stringifyProp(tabsData)}'${active === -1 ? '' : ` :active="${active}"`}${meta.id ? ` tab-id="${meta.id as string}"` : ''}>${titlesContent}`
    },

    tabsCloseRenderer: () => `</CodeTabs>`,

    tabOpenRenderer: ({ index }, tokens, tokenIndex) => {
      let foundFence = false

      // Hide all elements excerpt the first fence
      for (let i = tokenIndex; i < tokens.length; i++) {
        const { block, type } = tokens[i]

        if (block) {
          if (type === 'code-tabs_tab_close')
            break

          if ((type === 'fence' || type === 'import_code') && !foundFence) {
            foundFence = true
            continue
          }

          tokens[i].type = 'code_tab_empty'
          tokens[i].hidden = true
        }
      }

      return `<template #tab${index}="{ value, isActive }">`
    },

    tabCloseRenderer: () => `</template>`,
  })
}
