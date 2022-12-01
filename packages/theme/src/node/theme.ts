import type { App, Page, Theme } from '@vuepress/core'
import merge from 'lodash.merge'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { getAlias } from './alias.js'
import { createPage } from './createPage/index.js'
import { defaultLocaleOption } from './defaultLocaleOption.js'
import { extendsPage } from './extendsPage.js'
import { generateFrontmatter } from './generateFrontmatter.js'
import { getPlugins } from './plugins/index.js'
import { onPrepared, preparedWatch } from './prepared/index.js'
import { resolveClient, resolveTemplate } from './utils/index.js'

export const themePlume = ({
  themePlugins = {},
  ...localeOption
}: PlumeThemeOptions = {}): Theme => {
  localeOption = merge(defaultLocaleOption, localeOption)
  let watchMarkdown: null | ((app: App, watchers: unknown) => void) = null
  return {
    name: '@vuepress-plume/vuepress-theme-plume',
    templateBuild: resolveTemplate('index.build.html'),
    alias: getAlias(),
    clientConfigFile: resolveClient('config.js'),
    onInitialized: async (app) => {
      const { formatFrontmatter, watchNewMarkDown } = generateFrontmatter(
        app.options.source,
        localeOption
      )
      watchMarkdown = watchNewMarkDown
      await formatFrontmatter()
      await createPage(app, localeOption)
    },
    onPrepared: async (app) => await onPrepared(app, localeOption),
    extendsPage: (page: Page<Partial<PlumeThemePageData>>) =>
      extendsPage(page, localeOption),
    onWatched: (app, watchers) => {
      preparedWatch(app, watchers, localeOption)
      watchMarkdown && watchMarkdown(app, watchers)
    },
    plugins: getPlugins(themePlugins, localeOption),
  }
}
