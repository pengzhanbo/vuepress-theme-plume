import type { App, Page, Theme } from '@vuepress/core'
import { fs, getDirname, path } from '@vuepress/utils'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { mergeLocaleOptions } from './defaultOptions.js'
import { setupPlugins } from './plugins.js'
import { autoCategory, pageContentRendered, setupPage } from './setupPages.js'

const __dirname = getDirname(import.meta.url)
const name = '@vuepress-plume/theme-plume'
const resolve = (...args: string[]) => path.resolve(__dirname, '../', ...args)
const templates = (url: string) => resolve('../templates', url)

export const plumeTheme = ({
  themePlugins = {},
  ...localeOptions
}: PlumeThemeOptions = {}): Theme => {
  localeOptions = mergeLocaleOptions(localeOptions)
  return (app: App) => {
    return {
      name,
      templateBuild: templates('build.html'),
      clientConfigFile: resolve('client/config.js'),
      alias: {
        ...Object.fromEntries(
          fs
            .readdirSync(resolve('client/components'))
            .filter((file) => file.endsWith('.vue'))
            .map((file) => [
              `@theme/${file}`,
              resolve('client/components', file),
            ])
        ),
      },
      plugins: setupPlugins(app, themePlugins, localeOptions),
      onInitialized: async (app) => await setupPage(app, localeOptions),
      extendsPage: (page: Page<PlumeThemePageData>) => {
        autoCategory(app, page, localeOptions)
        pageContentRendered(page)
      },
    }
  }
}
