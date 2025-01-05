import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import { demoContainer, demoEmbed } from './demo.js'

export function demoPlugin(app: App, md: Markdown) {
  demoEmbed(app, md)
  demoContainer(app, md)
}

export * from './extendPage.js'
