import type { App, Plugin } from '@vuepress/core'
import { copyCodePlugin } from 'vuepress-plugin-copy-code2'
import type { PlumeThemePluginOptions } from '../../shared'

type PluginFunc = (options: any, app: App) => Plugin

export const resolveCopyCode = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.copyCode === false) return [] as unknown as Plugin
  return (app: App) => {
    console.log(app.dir.source())
    return (copyCodePlugin as unknown as PluginFunc)(
      plugins.copyCode || {
        selector: '.page-content div[class*="language-"] pre',
        locales: {
          '/': {
            copy: '复制成功',
            hint: '复制代码',
          },
        },
      },
      app
    )
  }
}
