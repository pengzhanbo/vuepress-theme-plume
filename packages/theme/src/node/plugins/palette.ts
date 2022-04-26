import type { PluginObject } from '@vuepress/core'
import { palettePlugin } from '@vuepress/plugin-palette'

export const resolvePalette = (): PluginObject => {
  return palettePlugin({ preset: 'sass' })
}
