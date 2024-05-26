import type { Page, Theme } from 'vuepress/core'
import { templateRenderer } from 'vuepress/utils'
import { isPlainObject } from '@vuepress/helper'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { getPlugins } from './plugins/index.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { THEME_NAME, getThemePackage, logger, resolve, templates } from './utils.js'
import { resolveEncrypt, resolveLocaleOptions, resolvePageHead } from './config/index.js'

export function plumeTheme({
  themePlugins,
  plugins,
  encrypt,
  hostname,
  ...localeOptions
}: PlumeThemeOptions = {}): Theme {
  const pluginOptions = plugins ?? themePlugins ?? {}
  const pkg = getThemePackage()

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

      plugins: getPlugins({ app, pluginOptions, localeOptions, encrypt, hostname }),

      onInitialized: async app => await setupPage(app, localeOptions),

      extendsPage: (page) => {
        extendsPageData(page as Page<PlumeThemePageData>, localeOptions)
        resolvePageHead(page, localeOptions)
      },

      templateBuildRenderer(template, context) {
        template = template
          .replace('{{ themeVersion }}', pkg.version || '')
          .replace(/^\s+|\s+$/gm, '')
          .replace(/\n/g, '')
        return templateRenderer(template, context)
      },
    }
  }
}
