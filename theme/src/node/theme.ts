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
  generateAFrontmatter,
  initAutoFrontmatter,
  watchAutoFrontmatter,
} from './autoFrontmatter/index.js'
import { prepareData, watchPrepare } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'
import { extendsMarkdown } from './extendsMarkdown.js'

export function plumeTheme(options: PlumeThemeOptions = {}): Theme {
  const {
    localeOptions,
    pluginOptions,
    hostname,
    configFile,
  } = resolveThemeOptions(options)

  return (app) => {
    initConfigLoader(app, localeOptions, {
      configFile,
      onChange: ({ localeOptions, autoFrontmatter }) => {
        autoFrontmatter ??= pluginOptions.frontmatter
        autoFrontmatter !== false && initAutoFrontmatter(localeOptions, autoFrontmatter)
      },
    })

    waitForConfigLoaded().then(({ autoFrontmatter }) => {
      autoFrontmatter ??= pluginOptions.frontmatter
      if (autoFrontmatter !== false) {
        generateAFrontmatter(app)
      }
    })

    return {
      name: THEME_NAME,

      define: resolveProvideData(app, pluginOptions),

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: resolveAlias(),

      plugins: getPlugins({ app, pluginOptions, hostname }),

      onInitialized: async (app) => {
        const { localeOptions } = await waitForConfigLoaded()
        await setupPage(app, localeOptions)
      },

      onPrepared: (app) => {
        onConfigChange(({ localeOptions }) => {
          prepareThemeData(app, localeOptions)
          prepareData(app)
        })
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
        const { localeOptions } = await waitForConfigLoaded()
        extendsPageData(page as Page<PlumeThemePageData>, localeOptions)
        resolvePageHead(page, localeOptions)
      },

      extendsMarkdown,

      extendsBundlerOptions,

      templateBuildRenderer,
    }
  }
}
