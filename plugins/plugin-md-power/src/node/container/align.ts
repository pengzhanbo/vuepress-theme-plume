import type { Markdown } from 'vuepress/markdown'
import { createContainerPlugin } from './createContainer.js'

const alignList = ['left', 'center', 'right', 'justify']

export function alignPlugin(md: Markdown): void {
  for (const name of alignList) {
    createContainerPlugin(md, name, {
      before: () => `<div style="text-align:${name}">`,
    })
  }
}
