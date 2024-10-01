import type { App } from 'vuepress'
import type { PlumeThemeData, PlumeThemeLocaleOptions, PlumeThemePluginOptions } from '../../shared/index.js'
import { resolveImageSize } from 'vuepress-plugin-md-power'
import { resolveThemeData } from '../config/resolveThemeData.js'
import { logger, resolveContent, writeTemp } from '../utils/index.js'

export async function prepareThemeData(
  app: App,
  localeOptions: PlumeThemeLocaleOptions,
  pluginOptions: PlumeThemePluginOptions,
): Promise<void> {
  const start = performance.now()
  const resolvedThemeData = resolveThemeData(app, localeOptions)

  await resolveProfileImage(app, resolvedThemeData, pluginOptions)

  const content = resolveContent(app, { name: 'themeData', content: resolvedThemeData })
  await writeTemp(app, 'internal/themePlumeData.js', content)

  if (app.env.isDebug) {
    logger.info(`Generate theme data: ${(performance.now() - start).toFixed(2)}ms`)
  }
}

async function resolveProfileImage(
  app: App,
  themeData: PlumeThemeData,
  pluginOptions: PlumeThemePluginOptions,
) {
  const imageSize = typeof pluginOptions.markdownPower === 'boolean' ? false : pluginOptions.markdownPower?.imageSize
  if (!app.env.isBuild || !imageSize)
    return

  const remote = imageSize === 'all'
  if (themeData.profile?.avatar) {
    const { width, height } = await resolveImageSize(app, themeData.profile.avatar, remote)
    if (width && height) {
      themeData.profile = {
        ...themeData.profile,
        originalWidth: width,
        originalHeight: height,
      } as any
    }
  }
  if (themeData.locales) {
    for (const locale of Object.keys(themeData.locales)) {
      if (themeData.locales[locale].profile?.avatar) {
        const { width, height } = await resolveImageSize(app, themeData.locales[locale].profile.avatar, remote)
        if (width && height) {
          themeData.locales[locale].profile = {
            ...themeData.locales[locale].profile,
            originalWidth: width,
            originalHeight: height,
          } as any
        }
      }
    }
  }
}
