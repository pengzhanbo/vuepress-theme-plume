import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { fileTreePlugin } from './fileTree.js'
import { langReplPlugin } from './langRepl.js'

export async function containerPlugin(
  app: App,
  md: Markdown,
  options: MarkdownPowerPluginOptions,
) {
  if (options.repl)
    await langReplPlugin(app, md, options.repl)

  if (options.fileTree) {
    // ::: file-tree
    fileTreePlugin(md)
  }
}
