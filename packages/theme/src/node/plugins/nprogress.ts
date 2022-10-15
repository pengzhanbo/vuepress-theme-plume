import type { Plugin } from '@vuepress/core'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import type { PlumeThemePluginOptions } from '../../shared/index.js'

export const resolveNprogress = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.nprogress === false) return [] as unknown as Plugin
  return nprogressPlugin()
}
