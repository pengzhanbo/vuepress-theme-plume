import type { Page, Theme } from 'vuepress/core'
import { logger, templateRenderer } from 'vuepress/utils'
import { isPlainObject } from '@vuepress/helper'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { setupPlugins } from './plugins.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { getThemePackage, resolve, templates } from './utils.js'
import { resolveEncrypt, resolveLocaleOptions, resolvePageHead } from './config/index.js'

const THEME_NAME = 'vuepress-theme-plume'

export function plumeTheme({
  themePlugins,
  plugins,
  encrypt,
  hostname,
  ...localeOptions
}: PlumeThemeOptions = {}): Theme {
  const pluginsOptions = plugins ?? themePlugins ?? {}
  const pkg = getThemePackage()
  const watermarkFullPage = isPlainObject(pluginsOptions.watermark)
    ? pluginsOptions.watermark.fullPage !== false
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

      plugins: setupPlugins({ app, options: pluginsOptions, localeOptions, encrypt, hostname }),

      onInitialized: app => setupPage(app, localeOptions),

      extendsPage: (page) => {
        extendsPageData(app, page as Page<PlumeThemePageData>, localeOptions)
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
