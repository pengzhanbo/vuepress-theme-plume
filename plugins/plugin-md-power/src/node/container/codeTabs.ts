import type { PluginWithOptions } from 'markdown-it'
import type { CodeTabsOptions } from '../../shared/index.js'
import { tab } from '@mdit/plugin-tab'
import { isPlainObject } from '@vuepress/helper'
import { definitions, getFileIconName, getFileIconTypeFromExtension } from '../fileIcons/index.js'
import { stringifyProp } from '../utils/stringifyProp.js'

export const codeTabs: PluginWithOptions<CodeTabsOptions> = (md, options: CodeTabsOptions = {}) => {
  const getIcon = (filename: string): string | void => {
    if (options.icon === false)
      return undefined
    const { named, extensions } = isPlainObject(options.icon) ? options.icon : {}
    if (named === false && definitions.named[filename])
      return undefined
    if (extensions === false && getFileIconTypeFromExtension(filename)) {
      return undefined
    }
    const hasNamed = named && named.length
    const hasExt = extensions && extensions.length
    if (hasNamed || hasExt) {
      if (hasNamed && named.includes(filename))
        return definitions.named[filename]
      if (hasExt && extensions.some(ext => filename.endsWith(ext)))
        return getFileIconTypeFromExtension(filename)
      return undefined
    }
    return getFileIconName(filename)
  }

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
        const icon = getIcon(title)
        return `<template #title${index}="{ value, isActive }">${icon ? `<VPIcon name="${icon}"/>` : ''}<span>${title}</span></template>`
      }).join('')

      return `<CodeTabs id="${index}" :data='${stringifyProp(tabsData)}'${active === -1 ? '' : ` :active="${active}"`}${meta.id ? ` tab-id="${meta.id as string}"` : ''}>${titlesContent}`
    },

    tabsCloseRenderer: () => `</CodeTabs>`,

    tabOpenRenderer: ({ index }, tokens, tokenIndex) => {
      let foundFence = false

      // Hide all elements excerpt the first fence
      for (let i = tokenIndex; i < tokens.length; i++) {
        const { type } = tokens[i]

        if (type === 'code-tabs_tab_close')
          break

        if ((type === 'fence' || type === 'import_code') && !foundFence) {
          foundFence = true
          continue
        }

        tokens[i].type = 'code_tab_empty'
        tokens[i].hidden = true
      }

      return `<template #tab${index}="{ value, isActive }">`
    },

    tabCloseRenderer: () => `</template>`,
  })
}
