import type { ThemeOptions } from '../../shared/index.js'

export function setupOptions({
  plugins = {},
  configFile,
  ...themeOptions
}: ThemeOptions) {
  return {
    configFile,
    plugins,
    themeOptions,
  }
}
