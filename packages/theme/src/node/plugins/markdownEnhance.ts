import type { PluginObject } from '@vuepress/core'
// import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveMarkdownEnhance = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.markdownEnhance === false) return false
  // return mdEnhancePlugin(
  //   Object.assign(
  //     {
  //       container: true, // info note tip warning danger details
  //       codegroup: true,
  //       align: true,
  //       mark: true,
  //       tasklist: true,
  //       demo: true,
  //     },
  //     plugins.markdownEnhance || {}
  //   )
  // )
  return false
}
