import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { isPlainObject } from '@vuepress/helper'
import { alignPlugin } from './align.js'
import { codeTabs } from './codeTabs.js'
import { fileTreePlugin } from './fileTree.js'
import { langReplPlugin } from './langRepl.js'
import { tabs } from './tabs.js'

export async function containerPlugin(
  app: App,
  md: Markdown,
  options: MarkdownPowerPluginOptions,
) {
  // ::: left / right / center / justify
  alignPlugin(md)
  // ::: tabs
  tabs(md)
  // ::: code-tabs
  codeTabs(md, options.codeTabs)

  if (options.repl)
    await langReplPlugin(app, md, options.repl)

  if (options.fileTree) {
    // ::: file-tree
    fileTreePlugin(md, isPlainObject(options.fileTree) ? options.fileTree : {})
  }
}
