import type { Page, Theme } from 'vuepress/core'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { getPlugins } from './plugins/index.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { THEME_NAME, resolve, templates } from './utils.js'
import {
  extendsBundlerOptions,
  resolveAlias,
  resolveLocaleOptions,
  resolvePageHead,
  resolveProvideData,
  resolveThemeOptions,
  templateBuildRenderer,
} from './config/index.js'
import { setupPrepare, watchPrepare } from './prepare/index.js'
import { extendsMarkdown } from './extendsMarkdown.js'

export function plumeTheme(options: PlumeThemeOptions = {}): Theme {
  const {
    localeOptions: rawLocaleOptions,
    pluginOptions,
    hostname,
    encrypt,
  } = resolveThemeOptions(options)

  return (app) => {
    const localeOptions = resolveLocaleOptions(app, rawLocaleOptions)

    return {
      name: THEME_NAME,

      define: resolveProvideData(app, pluginOptions, encrypt),

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: resolveAlias(),

      plugins: getPlugins({ app, pluginOptions, localeOptions, encrypt, hostname }),

      onInitialized: async (app) => {
        await setupPage(app, localeOptions)
      },

      onPrepared: async (app) => {
        await setupPrepare(app)
      },

      onWatched: (app, watchers) => {
        watchPrepare(app, watchers)
      },

      extendsPage: (page) => {
        extendsPageData(page as Page<PlumeThemePageData>, localeOptions)
        resolvePageHead(page, localeOptions)
      },

      extendsMarkdown,

      extendsBundlerOptions,

      templateBuildRenderer,
    }
  }
}
