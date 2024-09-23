import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { codeTabs } from './codeTabs.js'
import { fileTreePlugin } from './fileTree.js'
import { langReplPlugin } from './langRepl.js'
import { tabs } from './tabs.js'

export async function containerPlugin(
  app: App,
  md: Markdown,
  options: MarkdownPowerPluginOptions,
) {
  // ::: tabs
  tabs(md)
  // ::: code-tabs
  codeTabs(md)

  if (options.repl)
    await langReplPlugin(app, md, options.repl)

  if (options.fileTree) {
    // ::: file-tree
    fileTreePlugin(md)
  }
}
