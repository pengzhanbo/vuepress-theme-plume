import type { PluginSimple } from 'markdown-it'
import { tab } from '@mdit/plugin-tab'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { stringifyProp } from '../utils/stringifyProp.js'

export const tabs: PluginSimple = (md) => {
  tab(md, {
    name: 'tabs',

    tabsOpenRenderer: ({ active, data }, tokens, index, _, env) => {
      const { meta } = tokens[index]
      const titles = data.map(({ title }) => md.renderInline(title, cleanMarkdownEnv(env)))
      const tabsData = data.map((item, dataIndex) => {
        const { id = titles[dataIndex] } = item

        return { id }
      })

      return `<Tabs id="${index}" :data='${stringifyProp(tabsData)}'${active === -1 ? '' : ` :active="${active}"`}${meta.id ? ` tab-id="${meta.id as string}"` : ''}>
${titles.map((title, titleIndex) =>
  `<template #title${titleIndex}="{ value, isActive }">${title}</template>`,
).join('')}`
    },

    tabsCloseRenderer: () => `</Tabs>`,

    tabOpenRenderer: ({ index }) =>
      `<template #tab${index}="{ value, isActive }">`,

    tabCloseRenderer: () => `</template>`,
  })
}
