import { logger } from '../utils/index.js'
import type { PlumeThemeOptions } from '../../shared/index.js'

export function resolveThemeOptions({
  themePlugins,
  plugins,
  hostname,
  configFile,
  cache,
  ...localeOptions
}: PlumeThemeOptions) {
  const pluginOptions = plugins ?? themePlugins ?? {}

  if (themePlugins) {
    logger.warn(
      `The 'themePlugins' option is deprecated. Please use 'plugins' instead.`,
    )
  }

  return {
    cache,
    configFile,
    pluginOptions,
    hostname,
    localeOptions,
  }
}
