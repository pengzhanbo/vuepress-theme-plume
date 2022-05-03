import type { Plugin } from '@vuepress/core'
import { palettePlugin } from '@vuepress/plugin-palette'

export const resolvePalette = (): Plugin => {
  return palettePlugin({ preset: 'sass' })
}
