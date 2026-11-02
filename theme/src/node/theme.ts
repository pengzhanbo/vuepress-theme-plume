import type { Theme } from 'vuepress/core'
import type { ThemeOptions } from '../shared/index.js'
import {
  extendsBundlerOptions,
  setupAlias,
  setupProvideData,
  templateBuildRenderer,
} from './config/index.js'
import {
  genAutoFrontmatterRules,
  generateFileListFrontmatter,
  watchAutoFrontmatter,
} from './features/autoFrontmatter/index.js'
import { detectThemeOptions, detectVersions } from './features/detector/index.js'
import { configLoader } from './features/loadConfig/index.js'
import { createPages, extendsPageData } from './pages/index.js'
import { setupPlugins } from './plugins/index.js'
import { prepareData } from './prepare/index.js'
import { prepareThemeData } from './prepare/prepareThemeData.js'
import { logger, perf, resolve, setTranslateLang, templates, THEME_NAME } from './utils/index.js'

/**
 * VuePress Theme Plume
 *
 * VuePress 主题 Plume
 *
 * @param options Theme options / 主题配置
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

    configLoader
      .init(app, themeOptions, configFile)
      .catch(error => logger.error('Failed to load theme config.', error))

    configLoader.on('change', async () => {
      genAutoFrontmatterRules()
      await prepareThemeData(app, plugins)
      await prepareData(app)
    })

    let watchedRegistered = false

    return {
      name: THEME_NAME,
      define: setupProvideData(app, plugins),
      templateBuild: templates('build.html'),
      clientConfigFile: resolve('client/config.js'),
      alias: setupAlias(),
      plugins: setupPlugins(app, plugins),
      extendsMarkdownOptions: async () => {
        await configLoader.waiting()
        await generateFileListFrontmatter(app)
      },
      extendsBundlerOptions,
      templateBuildRenderer,
      extendsPage: extendsPageData,
      onInitialized: createPages,
      onPrepared: async () => {
        await prepareThemeData(app, plugins)
        await prepareData(app)
      },
      onPageUpdated: prepareData,
      onWatched: async (_, watchers) => {
        if (watchedRegistered)
          return

        watchedRegistered = true
        configLoader.watch(watchers as any)
        watchAutoFrontmatter(app, watchers as any)
      },
    }
  }
}
