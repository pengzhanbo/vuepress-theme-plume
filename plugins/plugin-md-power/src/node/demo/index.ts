import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import { demoContainer, demoEmbed } from './demo.js'
import { createDemoRender } from './watcher.js'

/**
 * Register demo plugin for markdown-it.
 *
 * 为 markdown-it 注册 demo 插件。
 *
 * This plugin enables demo syntax in markdown files, allowing users to
 * create interactive code demonstrations with live preview.
 *
 * 该插件在 markdown 文件中启用 demo 语法，允许用户创建带有实时预览的交互式代码演示。
 *
 * @param app - VuePress app instance / VuePress 应用实例
 * @param md - Markdown-it instance / Markdown-it 实例
 */
export function demoPlugin(app: App, md: Markdown): void {
  createDemoRender()
  demoEmbed(app, md)
  demoContainer(app, md)
}

export * from './extendPage.js'
export * from './watcher.js'
