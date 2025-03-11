import type { ThemeOptions } from '../../shared/index.js'
import { detectDependencies } from './dependency.js'
import { detectPlugins } from './plugins.js'

export * from './fields.js'

/**
 * 检测主题选项
 */
export function detectThemeOptions({
  plugins = {},
  configFile,
  ...themeOptions
}: ThemeOptions) {
  detectPlugins(plugins)
  detectDependencies(themeOptions, plugins)

  return { configFile, plugins, themeOptions }
}
