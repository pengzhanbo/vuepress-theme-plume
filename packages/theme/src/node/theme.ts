import type { App, Page, Theme } from '@vuepress/core'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared'
import { getAlias } from './alias'
import { createPage } from './createPage'
import { defaultLocaleOption } from './defaultLocaleOption'
import { extendsPage } from './extendsPage'
import { generateFrontmatter } from './generateFrontmatter'
import { getPlugins } from './plugins'
import { onPrepared, preparedWatch } from './prepared'
import { resolveClient, resolveTemplate } from './utils'
const merge = require('lodash.merge')

export const themePlume = ({
  themePlugins = {},
  ...localeOption
}: PlumeThemeOptions = {}): Theme => {
  localeOption = merge(defaultLocaleOption, localeOption)
  let watchMarkdown: null | ((app: App, watchers: unknown) => void) = null
  return {
    name: '@vuepress-plume/vuepress-theme-plume',
    layouts: resolveClient('layouts'),
    templateBuild: resolveTemplate('index.build.html'),
    alias: getAlias(),
    clientAppEnhanceFiles: resolveClient('clientAppEnhance.js'),
    clientAppSetupFiles: resolveClient('clientAppSetup.js'),
    onInitialized: async (app) => {
      const { formatFrontmatter, watchNewMarkDown } = generateFrontmatter(
        app.options.source,
        localeOption
      )
      watchMarkdown = watchNewMarkDown
      formatFrontmatter()
      await createPage(app, localeOption)
    },
    onPrepared: (app) => onPrepared(app, localeOption),
    extendsPage: (page: Page<Partial<PlumeThemePageData>>) =>
      extendsPage(page, localeOption),
    onWatched: (app, watchers) => {
      preparedWatch(app, watchers, localeOption)
      watchMarkdown && watchMarkdown(app, watchers)
    },
    plugins: getPlugins(themePlugins, localeOption),
  }
}
