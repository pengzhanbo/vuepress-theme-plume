import type { Page, Theme } from 'vuepress/core'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { sleep } from '@pengzhanbo/utils'
import { generateAutoFrontmatter, initAutoFrontmatter, watchAutoFrontmatter } from './autoFrontmatter/index.js'
import { extendsBundlerOptions, resolveAlias, resolveProvideData, resolveThemeOptions, templateBuildRenderer } from './config/index.js'
import { getThemeConfig, initConfigLoader, waitForConfigLoaded, watchConfigFile } from './loadConfig/index.js'
import { createPages, extendsPageData } from './pages/index.js'
import { getPlugins } from './plugins/index.js'
import { prepareData, watchPrepare } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'
import { resolve, templates, THEME_NAME } from './utils/index.js'

export function plumeTheme(options: PlumeThemeOptions = {}): Theme {
  const { localeOptions, pluginOptions, hostname, configFile, cache } = resolveThemeOptions(options)

  return (app) => {
    initConfigLoader(app, localeOptions, {
      configFile,
      onChange: ({ localeOptions, autoFrontmatter }) => {
        if (autoFrontmatter !== false)
          initAutoFrontmatter(localeOptions, autoFrontmatter)
      },
    })

    return {
      name: THEME_NAME,

      define: resolveProvideData(app, pluginOptions),

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: resolveAlias(),

      plugins: getPlugins(getThemeConfig().localeOptions, { app, pluginOptions, hostname, cache }),

      extendsBundlerOptions,

      templateBuildRenderer: (template, context) =>
        templateBuildRenderer(template, context, getThemeConfig().localeOptions),

      extendsMarkdown: async (_, app) => {
        const { autoFrontmatter, localeOptions } = await waitForConfigLoaded()
        if (autoFrontmatter !== false) {
          initAutoFrontmatter(localeOptions, autoFrontmatter)
          await generateAutoFrontmatter(app)
          // wait for autoFrontmatter generated
          // i/o performance
          await sleep(100)
        }
      },

      extendsPage: async (page) => {
        extendsPageData(page as Page<PlumeThemePageData>, getThemeConfig().localeOptions)
      },

      onInitialized: async (app) => {
        await createPages(app, getThemeConfig().localeOptions)
      },

      onPrepared: async (app) => {
        await prepareThemeData(app, getThemeConfig().localeOptions, pluginOptions)
        await prepareData(app)
      },

      onWatched: (app, watchers) => {
        watchConfigFile(app, watchers, async ({ localeOptions }) => {
          await prepareThemeData(app, localeOptions, pluginOptions)
          await prepareData(app)
        })
        watchAutoFrontmatter(app, watchers)
        watchPrepare(app, watchers)
      },
    }
  }
}
