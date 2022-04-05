import type { PluginConfig } from '@vuepress/core'
import type { TocPluginOptions } from '@vuepress/plugin-toc'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveToc = (plugins: PlumeThemePluginOptions): PluginConfig => {
  if (plugins.toc === false) return ['', false]
  return [
    '@vuepress/toc',
    {
      componentName: 'TocCom',
      defaultPropsOptions: {},
    } as TocPluginOptions,
  ]
}
