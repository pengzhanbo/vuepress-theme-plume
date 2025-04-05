import type { Page, Theme } from 'vuepress/core'
import type { ThemeOptions, ThemePageData } from '../shared/index.js'
import { sleep } from '@pengzhanbo/utils'
import {
  generateAutoFrontmatter,
  initAutoFrontmatter,
  watchAutoFrontmatter,
} from './autoFrontmatter/index.js'
import {
  extendsBundlerOptions,
  setupAlias,
  setupProvideData,
  templateBuildRenderer,
} from './config/index.js'
import { detectThemeOptions, detectVersions } from './detector/index.js'
import { initConfigLoader, waitForConfigLoaded, watchConfigFile } from './loadConfig/index.js'
import { createPages, extendsPageData } from './pages/index.js'
import { setupPlugins } from './plugins/index.js'
import { prepareData, watchPrepare } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'
import { perf, resolve, setTranslateLang, templates, THEME_NAME } from './utils/index.js'

export function plumeTheme(options: ThemeOptions = {}): Theme {
  return (app) => {
    setTranslateLang(app.options.lang)
    perf.init(app.env.isDebug)

    detectVersions(app)

    const { configFile, plugins, themeOptions } = detectThemeOptions(options)

    initConfigLoader(app, {
      configFile,
      defaultConfig: themeOptions,
      onChange: initAutoFrontmatter,
    })

    return {
      name: THEME_NAME,

      define: setupProvideData(app, plugins),

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: setupAlias(),

      plugins: setupPlugins(app, plugins),

      extendsBundlerOptions,

      templateBuildRenderer,

      extendsMarkdown: async (_, app) => {
        const { autoFrontmatter } = await waitForConfigLoaded()
        if (autoFrontmatter !== false) {
          initAutoFrontmatter()
          await generateAutoFrontmatter(app)
          // wait for autoFrontmatter generated
          // i/o performance
          await sleep(100)
        }
      },

      extendsPage: page => extendsPageData(page as Page<ThemePageData>),

      onInitialized: async app => await createPages(app),

      onPrepared: async (app) => {
        await prepareThemeData(app, plugins)
        await prepareData(app)
      },

      onWatched: (app, watchers) => {
        watchConfigFile(app, watchers, async () => {
          await prepareThemeData(app, plugins)
          await prepareData(app)
        })
        watchAutoFrontmatter(app, watchers)
        watchPrepare(app, watchers)
      },
    }
  }
}
