import type { Plugin } from '@vuepress/core'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveMarkdownEnhance = (
  plugins: PlumeThemePluginOptions
): Plugin => {
  if (plugins.markdownEnhance === false) return [] as unknown as Plugin
  return mdEnhancePlugin(
    Object.assign(
      {
        container: true, // info note tip warning danger details
        codetabs: true,
        tabs: true,
        align: true,
        mark: true,
        tasklist: true,
        demo: true,
        attrs: true,
      },
      plugins.markdownEnhance || {}
    )
  )
}
