import type { PluginConfig } from '@vuepress/core'
import { copyCode } from 'vuepress-plugin-copy-code2'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveCopyCode = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.copyCode === false) return ['', false]

  return copyCode(
    plugins.copyCode || {
      selector: '.page-content div[class*="language-"] pre',
      locales: {
        '/': {
          copy: '复制成功',
          hint: '复制代码',
        },
      },
    }
  )
}
