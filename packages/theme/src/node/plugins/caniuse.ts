import type { CanIUsePluginOptions } from '@vuepress-plume/vuepress-plugin-caniuse'
import type { PluginConfig } from '@vuepress/core'

export const resolveCanIUse = (
  options: Partial<CanIUsePluginOptions> | false
): PluginConfig => {
  if (options === false) return ['', false]
  return ['@vuepress-plume/caniuse', options]
}
