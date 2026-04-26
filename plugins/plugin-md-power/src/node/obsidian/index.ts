import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions, MDPowerLocaleData, ObsidianLocaleData } from '../../shared/index.js'
import { deepAssign, type ExactLocaleConfig } from '@vuepress/helper'
import { isPlainObject } from 'vuepress/shared'
import { findLocales } from '../utils/findLocales.js'
import { calloutPlugin } from './callouts.js'
import { commentPlugin } from './comment.js'
import { embedLinkPlugin } from './embedLink.js'
import { initPagePaths } from './findFirstPage.js'
import { wikiLinkPlugin } from './wikiLink.js'

export * from './findFirstPage.js'

export function obsidianPlugin(
  app: App,
  md: Markdown,
  options: MarkdownPowerPluginOptions,
  locales: ExactLocaleConfig<MDPowerLocaleData>,
) {
  if (options.obsidian === false)
    return

  const obsidian = isPlainObject(options.obsidian) ? options.obsidian : {}
  const obsidianLocales = findLocales(locales, 'obsidian')

  initPagePaths(app)

  if (obsidian.wikiLink !== false)
    wikiLinkPlugin(md)

  if (obsidian.embedLink !== false)
    embedLinkPlugin(md, app)

  if (obsidian.comment !== false)
    commentPlugin(md)

  if (obsidian.callout !== false) {
    const { locales = {}, ...options } = isPlainObject(obsidian.callout) ? obsidian.callout : {}
    calloutPlugin(md, {
      ...options,
      locales: deepAssign<Record<string, ObsidianLocaleData>>({}, obsidianLocales, locales),
    })
  }
}
