import type { PluginObject } from '@vuepress/core'
// import { copyCodePlugin } from 'vuepress-plugin-copy-code2'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveCopyCode = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.copyCode === false) return false

  // return copyCodePlugin(
  //   plugins.copyCode || {
  //     selector: '.page-content div[class*="language-"] pre',
  //     locales: {
  //       '/': {
  //         copy: '复制成功',
  //         hint: '复制代码',
  //       },
  //     },
  //   }
  // )
  return false
}
