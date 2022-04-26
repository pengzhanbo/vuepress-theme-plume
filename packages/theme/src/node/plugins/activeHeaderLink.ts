import type { PluginObject } from '@vuepress/core'
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links'

export const resolveActiveHeaderLink = (): PluginObject => {
  return activeHeaderLinksPlugin({
    headerLinkSelector: 'a.theme-plume-toc-link',
    headerAnchorSelector: '.header-anchor',
    delay: 200,
    offset: 20,
  })
}
