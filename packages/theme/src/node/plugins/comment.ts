import type { PluginConfig } from '@vuepress/core'
import type { CommentOptions } from 'vuepress-plugin-comment2'
import { comment } from 'vuepress-plugin-comment2'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveComment = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.comment === false) return ['', false]
  return comment(plugins.comment as CommentOptions)
}
