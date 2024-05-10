import type { Page, Theme } from 'vuepress/core'
import { logger, templateRenderer } from 'vuepress/utils'
import { addViteConfig, isPlainObject } from '@vuepress/helper'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { mergeLocaleOptions } from './defaultOptions.js'
import { setupPlugins } from './plugins.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { getThemePackage, resolve, templates } from './utils.js'
import { resolveEncrypt } from './resolveEncrypt.js'
import { resolvePageHead } from './resolvePageHead.js'

const THEME_NAME = 'vuepress-theme-plume'

export function plumeTheme({
  themePlugins,
  plugins,
  encrypt,
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
    localeOptions = mergeLocaleOptions(app, localeOptions)
    return {
      name: THEME_NAME,

      define: {
        ...resolveEncrypt(encrypt),
        __PLUME_WM_FP__: watermarkFullPage,
      },

      templateBuild: templates('build.html'),

      clientConfigFile: resolve('client/config.js'),

      plugins: setupPlugins(app, pluginsOptions, localeOptions, encrypt),

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

      extendsBundlerOptions: (options, app) => {
        addViteConfig(options, app, {
          server: { fs: { cachedChecks: false } },
        })
      },
    }
  }
}
