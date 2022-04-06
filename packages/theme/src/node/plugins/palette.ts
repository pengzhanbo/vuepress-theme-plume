import type { PluginConfig } from '@vuepress/core'

export const resolvePalette = (): PluginConfig => {
  return ['@vuepress/plugin-palette', { preset: 'sass' }]
}
