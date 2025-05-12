import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import { demoContainer, demoEmbed } from './demo.js'
import { createDemoRender } from './watcher.js'

export function demoPlugin(app: App, md: Markdown): void {
  createDemoRender()
  demoEmbed(app, md)
  demoContainer(app, md)
}

export * from './extendPage.js'
export * from './watcher.js'
