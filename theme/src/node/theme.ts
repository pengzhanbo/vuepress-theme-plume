import type { Page, Theme } from 'vuepress/core'
import type { ThemeOptions, ThemePageData } from '../shared/index.js'
import {
  genAutoFrontmatterRules,
  generateFileListFrontmatter,
  watchAutoFrontmatter,
} from './autoFrontmatter/index.js'
import {
  extendsBundlerOptions,
  setupAlias,
  setupProvideData,
  templateBuildRenderer,
} from './config/index.js'
import { detectThemeOptions, detectVersions } from './detector/index.js'
import { configLoader } from './loadConfig/index.js'
import { createPages, extendsPageData } from './pages/index.js'
import { setupPlugins } from './plugins/index.js'
import { prepareData, watchPrepare } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'
import { perf, resolve, setTranslateLang, templates, THEME_NAME } from './utils/index.js'

/**
 * VuePress Theme Plume
 * @param options 主题配置
 * @example
 * ```ts
 * import { defineUserConfig } from 'vuepress'
 * import { plumeTheme } from 'vuepress-theme-plume'
 *
 * export default defineUserConfig({
 *   theme: plumeTheme({
 *     // ...options
 *   })
 * })
 * ```
 */
export function plumeTheme(options: ThemeOptions = {}): Theme {
  return (app) => {
    setTranslateLang(app.options.lang)
    perf.init(app.env.isDebug)

    detectVersions(app)

    const { configFile, plugins, themeOptions } = detectThemeOptions(options)

    configLoader.init(app, themeOptions, configFile)
    configLoader.on('change', async () => {
      genAutoFrontmatterRules()
      await prepareThemeData(app, plugins)
      await prepareData(app)
    })

    return {
      name: THEME_NAME,

      define: setupProvideData(app, plugins),

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: setupAlias(),

      plugins: setupPlugins(app, plugins),

      extendsMarkdownOptions: async (_, app) => {
        await configLoader.waiting()
        await generateFileListFrontmatter(app)
      },

      extendsBundlerOptions,

      templateBuildRenderer,

      extendsPage: page => extendsPageData(page as Page<ThemePageData>),

      onInitialized: async app => await createPages(app),

      onPrepared: async (app) => {
        await prepareThemeData(app, plugins)
        await prepareData(app)
      },

      onWatched: async (app, watchers) => {
        configLoader.watch(watchers as any)
        watchPrepare(app, watchers)
        watchAutoFrontmatter(app, watchers as any)
      },
    }
  }
}
