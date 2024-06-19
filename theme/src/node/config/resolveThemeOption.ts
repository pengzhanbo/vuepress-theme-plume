import type { PlumeThemeOptions } from '../../shared/index.js'
import { logger } from '../utils.js'

export function resolveThemeOptions({ themePlugins, plugins, encrypt, hostname, ...localeOptions }: PlumeThemeOptions) {
  const pluginOptions = plugins ?? themePlugins ?? {}

  if (themePlugins) {
    logger.warn(
      `The 'themePlugins' option is deprecated. Please use 'plugins' instead.`,
    )
  }

  return {
    pluginOptions,
    encrypt,
    hostname,
    localeOptions,
  }
}
