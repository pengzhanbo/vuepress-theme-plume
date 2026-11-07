import type { Page, Theme } from 'vuepress/core'
import type { ThemeOptions, ThemePageData } from '../shared/index.js'
import { noop } from '@pengzhanbo/utils'
import { extendsBundlerOptions, setupAlias, setupProvideData, templateBuildRenderer } from './config/index.js'
import { genAutoFrontmatterRules, generateMarkdownFrontmatter } from './features/autoFrontmatter/index.js'
import { detectThemeOptions, detectVersions } from './features/detector/index.js'
import { collectDraftPage, excludeDraftPages, resetDraftPages } from './features/draft.js'
import { initMarkdownSource } from './features/markdown-source.js'
import { initConfigLoader } from './options.js'
import { createPages, extendsPageData } from './pages/index.js'
import { setupPlugins } from './plugins/index.js'
import { watchBulletinFiles } from './prepare/bulletin.js'
import { prepareData } from './prepare/index.js'
import { prepareThemeData } from './prepare/theme-data.js'
import { perf, resolve, setTranslateLang, templates, THEME_NAME } from './utils/index.js'

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

    const configLoader = initConfigLoader(app, themeOptions, configFile)
    configLoader.on('change', async () => {
      genAutoFrontmatterRules()
      await prepareThemeData(app, plugins)
      await prepareData(app)
    })

    const markdownSource = initMarkdownSource({
      cwd: app.dir.source(),
      pagePatterns: app.options.pagePatterns,
    })

    markdownSource.onWrite(generateMarkdownFrontmatter)

    app.env.isBuild && markdownSource.onWrite(collectDraftPage)

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
        genAutoFrontmatterRules()

        app.env.isBuild && resetDraftPages() // 重置草稿页面

        await markdownSource.run().catch(noop)

        app.env.isBuild && excludeDraftPages(app) // 排除草稿页面
      },
      extendsBundlerOptions,
      templateBuildRenderer,
      extendsPage: page => extendsPageData(page as Page<ThemePageData>),
      onInitialized: () => createPages(app),
      onPrepared: async () => {
        await prepareThemeData(app, plugins)
        await prepareData(app)
      },
      onPageUpdated: app => prepareData(app),
      onWatched: async (_, watchers) => {
        if (watchedRegistered)
          return

        watchedRegistered = true
        configLoader.watch(watchers as any)
        markdownSource.watch(watchers as any)
        watchBulletinFiles(app, watchers as any)
      },
    }
  }
}
