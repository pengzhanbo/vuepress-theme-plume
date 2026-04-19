import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { isPlainObject } from 'vuepress/shared'
import { commentPlugin } from './comment.js'
import { embedLinkPlugin } from './embedLink.js'
import { initPagePaths } from './findFirstPage.js'
import { wikiLinkPlugin } from './wikiLink.js'

export * from './findFirstPage.js'

export function obsidianPlugin(
  app: App,
  md: Markdown,
  options: MarkdownPowerPluginOptions,
) {
  if (options.obsidian === false)
    return

  const obsidian = isPlainObject(options.obsidian) ? options.obsidian : {}

  initPagePaths(app)

  if (obsidian.wikiLink !== false)
    wikiLinkPlugin(md)

  if (obsidian.embedLink !== false)
    embedLinkPlugin(md, app)

  if (obsidian.comment !== false)
    commentPlugin(md)
}
