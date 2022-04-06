import type { PluginConfig } from '@vuepress/core'
import { mdEnhance } from 'vuepress-plugin-md-enhance'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveMarkdownEnhance = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.markdownEnhance === false) return ['', false]
  return mdEnhance(
    plugins.markdownEnhance || {
      container: true, // info note tip warning danger details
      codegroup: true,
      align: true,
      mark: true,
      tasklist: true,
      demo: true,
    }
  )
}
