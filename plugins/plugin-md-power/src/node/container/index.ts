import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { isPlainObject } from '@vuepress/helper'
import { alignPlugin } from './align.js'
import { cardPlugin } from './card.js'
import { codeTabs } from './codeTabs.js'
import { demoWrapperPlugin } from './demoWrapper.js'
import { fileTreePlugin } from './fileTree.js'
import { langReplPlugin } from './langRepl.js'
import { npmToPlugins } from './npmTo.js'
import { stepsPlugin } from './steps.js'
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

  // ::: demo-wrapper
  demoWrapperPlugin(md)

  // ::: steps
  stepsPlugin(md)

  // ::: card / card-grid
  cardPlugin(md)

  if (options.npmTo) {
    // ::: npm-to
    npmToPlugins(md, typeof options.npmTo === 'boolean' ? {} : options.npmTo)
  }

  if (options.repl)
    // ::: rust-repl / go-repl / kotlin-repl
    await langReplPlugin(app, md, options.repl)

  if (options.fileTree) {
    // ::: file-tree
    fileTreePlugin(md, isPlainObject(options.fileTree) ? options.fileTree : {})
  }
}
