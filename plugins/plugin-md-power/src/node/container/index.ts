import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import type { MDPowerLocaleData } from '../../shared/locale.js'
import { type ExactLocaleConfig, isPlainObject } from '@vuepress/helper'
import { findLocales } from '../utils/findLocales.js'
import { alignPlugin } from './align.js'
import { cardPlugin } from './card.js'
import { chatPlugin } from './chat.js'
import { codeTabs } from './codeTabs.js'
import { codeTreePlugin } from './codeTree.js'
import { collapsePlugin } from './collapse.js'
import { encryptPlugin } from './encrypt.js'
import { fieldPlugin } from './field.js'
import { fileTreePlugin } from './fileTree.js'
import { langReplPlugin } from './langRepl.js'
import { npmToPlugins } from './npmTo.js'
import { stepsPlugin } from './steps.js'
import { tablePlugin } from './table.js'
import { tabs } from './tabs.js'
import { timelinePlugin } from './timeline.js'
import { windowPlugin } from './window.js'

/**
 * Container plugin - Register all container plugins
 *
 * 容器插件 - 注册所有容器插件
 *
 * @param app - VuePress app / VuePress 应用
 * @param md - Markdown instance / Markdown 实例
 * @param options - Plugin options / 插件选项
 * @param locales - Locale configuration / 本地化配置
 */
export async function containerPlugin(
  app: App,
  md: Markdown,
  options: MarkdownPowerPluginOptions,
  locales: ExactLocaleConfig<MDPowerLocaleData>,
): Promise<void> {
  // ::: left / right / center / justify
  alignPlugin(md)
  // ::: tabs
  tabs(md)
  // ::: code-tabs
  codeTabs(md, options.codeTabs)

  // ::: window
  windowPlugin(md)

  // ::: steps
  stepsPlugin(md)

  // ::: card / card-grid
  cardPlugin(md)

  if (options.encrypt) {
    // ::: encrypt password="xxx"
    encryptPlugin(app, md, typeof options.encrypt === 'boolean' ? {} : options.encrypt)
  }

  if (options.npmTo) {
    // ::: npm-to
    npmToPlugins(md, typeof options.npmTo === 'boolean' ? {} : options.npmTo)
  }

  if (options.repl)
    // ::: rust-repl / go-repl / kotlin-repl / python-repl
    await langReplPlugin(app, md, options.repl)

  if (options.fileTree) {
    // ::: file-tree
    fileTreePlugin(md, isPlainObject(options.fileTree) ? options.fileTree : {}, findLocales(locales, 'common'))
  }

  if (options.codeTree) {
    codeTreePlugin(md, app, isPlainObject(options.codeTree) ? options.codeTree : {})
  }

  if (options.timeline)
    timelinePlugin(md)

  if (options.collapse)
    collapsePlugin(md)

  if (options.chat)
    chatPlugin(md)

  if (options.field)
    fieldPlugin(md)

  if (options.table)
    tablePlugin(md, isPlainObject(options.table) ? options.table : {})
}
