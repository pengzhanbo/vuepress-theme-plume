import type { Plugin } from '@vuepress/core'
import { commentPlugin } from 'vuepress-plugin-comment2'
import type { CommentOptions } from 'vuepress-plugin-comment2'
import type { PlumeThemePluginOptions } from '../../shared/index.js'

export const resolveComment = (plugins: PlumeThemePluginOptions): Plugin => {
  if (!plugins.comment) return [] as unknown as Plugin
  return commentPlugin(plugins.comment as CommentOptions)
}
