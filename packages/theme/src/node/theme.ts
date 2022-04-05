import type { Page, Theme } from '@vuepress/core'
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

export const themePlume: Theme<PlumeThemeOptions> = (
  { themePlugins = {}, ...localeOption },
  app
) => {
  if (app.options.bundler.endsWith('vite')) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    app.options.bundlerConfig.viteOptions = require('vite').mergeConfig(
      app.options.bundlerConfig.viteOptions,
      {
        css: {
          preprocessorOptions: {
            scss: { charset: false },
          },
        },
      }
    )
  }
  localeOption = merge(defaultLocaleOption, localeOption)
  const { formatFrontmatter, watchNewMarkDown } = generateFrontmatter(
    app.options.source,
    localeOption
  )
  formatFrontmatter()
  return {
    name: '@vuepress-plume/vuepress-theme-plume',
    layouts: resolveClient('layouts'),
    templateBuild: resolveTemplate('index.build.html'),
    alias: getAlias(),
    clientAppEnhanceFiles: resolveClient('clientAppEnhance.js'),
    clientAppSetupFiles: resolveClient('clientAppSetup.js'),
    onInitialized: async (app) => {
      await createPage(app, localeOption)
    },
    onPrepared: (app) => onPrepared(app, localeOption),
    extendsPage: (page: Page<PlumeThemePageData>) =>
      extendsPage(page, localeOption),
    onWatched: (app, watchers) => {
      preparedWatch(app, watchers, localeOption)
      watchNewMarkDown(app, watchers)
    },
    plugins: getPlugins(app, themePlugins, localeOption),
  }
}
