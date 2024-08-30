import type { Page, Theme } from 'vuepress/core'
import { sleep } from '@pengzhanbo/utils'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { getPlugins } from './plugins/index.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { THEME_NAME, resolve, templates } from './utils/index.js'
import { extendsBundlerOptions, resolveAlias, resolvePageHead, resolveProvideData, resolveThemeOptions, templateBuildRenderer } from './config/index.js'
import { getThemeConfig, initConfigLoader, waitForConfigLoaded, watchConfigFile } from './loadConfig/index.js'
import { generateAutoFrontmatter, initAutoFrontmatter, watchAutoFrontmatter } from './autoFrontmatter/index.js'
import { prepareData, watchPrepare } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'

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

      plugins: getPlugins({ app, pluginOptions, hostname, cache }),

      extendsBundlerOptions,

      templateBuildRenderer,

      extendsMarkdown: async (_, app) => {
        const { autoFrontmatter } = await waitForConfigLoaded()
        if (autoFrontmatter !== false) {
          await generateAutoFrontmatter(app)
          // wait for autoFrontmatter generated
          // i/o performance
          await sleep(100)
        }
      },

      extendsPage: async (page) => {
        const { localeOptions } = getThemeConfig()
        extendsPageData(page as Page<PlumeThemePageData>, localeOptions)
        resolvePageHead(page, localeOptions)
      },

      onInitialized: async (app) => {
        const { localeOptions } = getThemeConfig()
        await setupPage(app, localeOptions)
      },

      onPrepared: async (app) => {
        const { localeOptions } = getThemeConfig()
        await prepareThemeData(app, localeOptions)
        await prepareData(app)
      },

      onWatched: (app, watchers) => {
        watchConfigFile(app, watchers, async ({ localeOptions }) => {
          await prepareThemeData(app, localeOptions)
          await prepareData(app)
        })
        watchAutoFrontmatter(app, watchers)
        watchPrepare(app, watchers)
      },
    }
  }
}
