import type { PluginObject } from '@vuepress/core'
// import type { CommentOptions } from 'vuepress-plugin-comment2'
// import { commentPlugin } from 'vuepress-plugin-comment2'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveComment = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.comment === false) return false
  // return commentPlugin(plugins.comment as CommentOptions)
  return false
}
