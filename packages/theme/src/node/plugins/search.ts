import type { Plugin } from '@vuepress/core'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { searchPlugin } from '@vuepress/plugin-search'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveSearch = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.search !== false) {
    return searchPlugin(plugins.search)
  }
  if (plugins.docsearch) {
    return docsearchPlugin(plugins.docsearch)
  }
  return [] as unknown as Plugin
}
