import type { PluginObject } from '@vuepress/core'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { searchPlugin } from '@vuepress/plugin-search'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveSearch = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.search !== false) {
    return searchPlugin(plugins.search)
  }
  if (plugins.docsearch) {
    return docsearchPlugin(plugins.docsearch)
  }
  return false
}
