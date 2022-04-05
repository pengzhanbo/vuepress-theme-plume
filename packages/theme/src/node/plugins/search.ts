import type { PluginConfig } from '@vuepress/core'
import { logger } from '@vuepress/utils'
import type { PlumeThemePluginOptions } from '../../shared'

const hasDocsearchInstalled = (): boolean => {
  try {
    require.resolve('@vuepress/plugin-docsearch')
    return true
  } catch {
    return false
  }
}

const hasSearchInstalled = (): boolean => {
  try {
    require.resolve('@vuepress/plugin-search')
    return true
  } catch {
    return false
  }
}

export const resolveSearch = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.search) {
    if (!hasSearchInstalled()) {
      logger.error('@vuepress/plugin-search is not installed.')
      return ['', false]
    }
    return ['@vuepress/search', plugins.search]
  }
  if (plugins.docsearch) {
    if (!hasDocsearchInstalled()) {
      logger.error('@vuepress/plugin-docsearch is not installed.')
      return ['', false]
    }
    return ['@vuepress/docsearch', plugins.docsearch]
  }
  return ['', false]
}
