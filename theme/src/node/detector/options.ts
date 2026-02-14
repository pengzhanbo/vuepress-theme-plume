import type { ThemeBuiltinPlugins, ThemeOptions } from '../../shared/index.js'
import { detectBreakingChange } from './breakingChange.js'
import { detectDependencies } from './dependency.js'
import { detectMarkdown } from './markdown.js'
import { detectPlugins } from './plugins.js'

/**
 * Detect theme options
 *
 * 检测主题选项
 */
export function detectThemeOptions({
  plugins = {},
  configFile,
  ...themeOptions
}: ThemeOptions): {
  configFile: string | undefined
  plugins: ThemeBuiltinPlugins
  themeOptions: Omit<ThemeOptions, 'plugins' | 'configFile'>
} {
  detectDependencies(themeOptions, plugins)

  // detect options
  detectMarkdown(themeOptions)
  detectPlugins(plugins)
  detectBreakingChange(themeOptions)

  return { configFile, plugins, themeOptions }
}
