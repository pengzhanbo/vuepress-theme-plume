import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { isPlainObject } from 'vuepress/shared'
import { commentPlugin } from './comment.js'
import { embedLinkPlugin } from './embedLink.js'
import { wikiLinkPlugin } from './wikiLink.js'

export function obsidianPlugin(
  md: Markdown,
  app: App,
  options: MarkdownPowerPluginOptions,
) {
  if (!options.obsidian)
    return

  const obsidian = isPlainObject(options.obsidian) ? options.obsidian : {}

  if (obsidian.wikiLink !== false)
    wikiLinkPlugin(md, app)

  if (obsidian.embedLink !== false)
    embedLinkPlugin(md, app)

  if (obsidian.comment !== false)
    commentPlugin(md)
}
