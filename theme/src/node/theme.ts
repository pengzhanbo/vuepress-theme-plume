import type { Page, Theme } from 'vuepress/core'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { getPlugins } from './plugins/index.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { THEME_NAME, resolve, templates } from './utils/index.js'
import {
  extendsBundlerOptions,
  resolveAlias,
  resolvePageHead,
  resolveProvideData,
  resolveThemeOptions,
  templateBuildRenderer,
} from './config/index.js'
import {
  getResolvedThemeConfig,
  initConfigLoader,
  onConfigChange,
  waitForConfigLoaded,
  watchConfigFile,
} from './loadConfig/index.js'
import {
  generateAutoFrontmatter,
  initAutoFrontmatter,
  waitForAutoFrontmatter,
  watchAutoFrontmatter,
} from './autoFrontmatter/index.js'
import { prepareData, watchPrepare } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'

export function plumeTheme(options: PlumeThemeOptions = {}): Theme {
  const {
    localeOptions,
    pluginOptions,
    hostname,
    configFile,
    cache,
  } = resolveThemeOptions(options)

  return (app) => {
    initConfigLoader(app, localeOptions, {
      configFile,
      onChange: ({ localeOptions, autoFrontmatter }) => {
        autoFrontmatter ??= pluginOptions.frontmatter
        if (autoFrontmatter !== false) {
          initAutoFrontmatter(localeOptions, autoFrontmatter)
        }
      },
    })

    waitForConfigLoaded().then(({ autoFrontmatter }) => {
      autoFrontmatter ??= pluginOptions.frontmatter
      if (autoFrontmatter !== false) {
        generateAutoFrontmatter(app)
      }
    })

    return {
      name: THEME_NAME,

      define: resolveProvideData(app, pluginOptions),

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: resolveAlias(),

      plugins: getPlugins({ app, pluginOptions, hostname, cache }),

      onInitialized: async (app) => {
        const { localeOptions } = await waitForConfigLoaded()
        await setupPage(app, localeOptions)
      },

      onPrepared: async (app) => {
        onConfigChange(async ({ localeOptions }) => {
          await prepareThemeData(app, localeOptions)
          await prepareData(app)
        })
        const { localeOptions } = await waitForConfigLoaded()
        await waitForAutoFrontmatter()
        await prepareThemeData(app, localeOptions)
        await prepareData(app)
      },

      onWatched: (app, watchers) => {
        watchConfigFile(app, watchers)
        watchPrepare(app, watchers)
        watchAutoFrontmatter(app, watchers, () => {
          const autoFrontmatter = getResolvedThemeConfig().autoFrontmatter ?? pluginOptions.frontmatter
          return autoFrontmatter !== false
        })
      },

      extendsPage: async (page) => {
        const { localeOptions, autoFrontmatter } = await waitForConfigLoaded()
        if ((autoFrontmatter ?? pluginOptions.frontmatter) !== false) {
          await waitForAutoFrontmatter()
        }
        extendsPageData(page as Page<PlumeThemePageData>, localeOptions)
        resolvePageHead(page, localeOptions)
      },

      extendsBundlerOptions,

      templateBuildRenderer,
    }
  }
}
