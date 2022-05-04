// import { copyCodePlugin } from '@vuepress-plume/vuepress-plugin-copy-code'
import type { Plugin } from '@vuepress/core'
import { copyCodePlugin } from 'vuepress-plugin-copy-code2'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveCopyCode = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.copyCode === false) return [] as unknown as Plugin
  return copyCodePlugin(
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
