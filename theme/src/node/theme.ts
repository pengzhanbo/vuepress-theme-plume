import type { Page, Theme } from 'vuepress/core'
import { fs } from 'vuepress/utils'
import { isPlainObject } from '@vuepress/helper'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { getPlugins } from './plugins/index.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { THEME_NAME, logger, resolve, templates } from './utils.js'
import { resolveEncrypt, resolveLocaleOptions, resolvePageHead } from './config/index.js'
import { extendsBundlerOptions } from './extendsBundlerOptions.js'
import { templateBuildRenderer } from './templateBuildRenderer.js'
import { setupPrepare, watchPrepare } from './prepare/index.js'

export function plumeTheme({
  themePlugins,
  plugins,
  encrypt,
  hostname,
  ...localeOptions
}: PlumeThemeOptions = {}): Theme {
  const pluginOptions = plugins ?? themePlugins ?? {}

  const watermarkFullPage = isPlainObject(pluginOptions.watermark)
    ? pluginOptions.watermark.fullPage !== false
    : true

  if (themePlugins) {
    logger.warn(
      `The 'themePlugins' option is deprecated. Please use 'plugins' instead.`,
    )
  }

  return (app) => {
    localeOptions = resolveLocaleOptions(app, localeOptions)

    return {
      name: THEME_NAME,

      define: {
        ...resolveEncrypt(encrypt),
        __PLUME_WM_FP__: watermarkFullPage,
      },

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      alias: {
        ...Object.fromEntries(
          fs.readdirSync(
            resolve('client/components'),
            { encoding: 'utf-8', recursive: true },
          )
            .filter(file => file.endsWith('.vue'))
            .map(file => [
              `@theme/${file}`,
              resolve('client/components', file),
            ]),
        ),
      },

      plugins: getPlugins({ app, pluginOptions, localeOptions, encrypt, hostname }),

      onInitialized: async (app) => {
        await setupPage(app, localeOptions)
      },

      onPrepared: async (app) => {
        await setupPrepare(app)
      },

      onWatched: (app, watchers) => {
        watchPrepare(app, watchers)
      },

      extendsPage: (page) => {
        extendsPageData(page as Page<PlumeThemePageData>, localeOptions)
        resolvePageHead(page, localeOptions)
      },

      extendsBundlerOptions,

      templateBuildRenderer,
    }
  }
}
