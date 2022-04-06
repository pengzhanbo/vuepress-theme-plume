import type { PluginConfig } from '@vuepress/core'
import type { ActiveHeaderLinksPluginOptions } from '@vuepress/plugin-active-header-links'

export const resolveActiveHeaderLink = (): PluginConfig => {
  return [
    '@vuepress/active-header-links',
    {
      headerLinkSelector: 'a.theme-plume-toc-link',
      headerAnchorSelector: '.header-anchor',
      delay: 200,
      offset: 80,
    } as ActiveHeaderLinksPluginOptions,
  ]
}
