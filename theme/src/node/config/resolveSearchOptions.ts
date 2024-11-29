import type { SearchPluginOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchPluginOptions } from '@vuepress/plugin-docsearch'
import type { App } from 'vuepress'
import { getLocaleConfig } from '@vuepress/helper'
import { DOCSEARCH_LOCALES, SEARCH_LOCALES } from '../locales/index.js'

export function resolveSearchOptions(
  app: App,
  { locales, ...options }: SearchPluginOptions = {},
): SearchPluginOptions {
  return {
    ...options,
    locales: getLocaleConfig({
      app,
      default: SEARCH_LOCALES,
      config: locales,
    }),
  }
}

export function resolveDocsearchOptions(
  app: App,
  { locales, ...options }: DocSearchPluginOptions = {},
): DocSearchPluginOptions {
  return {
    ...options,
    locales: getLocaleConfig({
      app,
      default: DOCSEARCH_LOCALES,
      config: locales,
    }),
  }
}
