import type { App, Page, Theme } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { mergeLocaleOptions } from './defaultOptions.js'
import { setupPlugins } from './plugins.js'
import { extendsPageData, setupPage } from './setupPages.js'

const __dirname = getDirname(import.meta.url)
const name = 'vuepress-theme-plume'
const resolve = (...args: string[]) => path.resolve(__dirname, '../', ...args)
const templates = (url: string) => resolve('../templates', url)

export function plumeTheme({
  themePlugins = {},
  ...localeOptions
}: PlumeThemeOptions = {}): Theme {
  localeOptions = mergeLocaleOptions(localeOptions)
  return (app: App) => {
    return {
      name,
      templateBuild: templates('build.html'),
      clientConfigFile: resolve('client/config.js'),
      plugins: setupPlugins(app, themePlugins, localeOptions),
      onInitialized: async app => await setupPage(app, localeOptions),
      extendsPage: (page: Page<PlumeThemePageData>) =>
        extendsPageData(app, page, localeOptions)
      ,
    }
  }
}
