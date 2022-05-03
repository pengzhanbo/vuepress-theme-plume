import type { App, Plugin } from '@vuepress/core'
import { commentPlugin } from 'vuepress-plugin-comment2'
import type { CommentOptions } from 'vuepress-plugin-comment2'
import type { PlumeThemePluginOptions } from '../../shared'

type PluginFunc = (options: CommentOptions, app: App) => Plugin

export const resolveComment = (plugins: PlumeThemePluginOptions): Plugin => {
  if (!plugins.comment) return [] as unknown as Plugin
  return (app: App) => {
    return (commentPlugin as unknown as PluginFunc)(
      plugins.comment as CommentOptions,
      app
    )
  }
}
