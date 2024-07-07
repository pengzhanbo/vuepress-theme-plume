import type { PlumeThemeOptions } from '../../shared/index.js'
import { logger } from '../utils/index.js'

export function resolveThemeOptions({
  themePlugins,
  plugins,
  hostname,
  configFile,
  ...localeOptions
}: PlumeThemeOptions) {
  const pluginOptions = plugins ?? themePlugins ?? {}

  if (themePlugins) {
    logger.warn(
      `The 'themePlugins' option is deprecated. Please use 'plugins' instead.`,
    )
  }

  return {
    configFile,
    pluginOptions,
    hostname,
    localeOptions,
  }
}
