import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeConfig: ThemeCollectionItem = defineCollection({
  type: 'doc',
  title: 'Config',
  dir: 'config',
  linkPrefix: '/config/',
  sidebar: [
    {
      text: 'Configuration',
      collapsed: false,
      items: [
        'intro',
        'theme',
        'locales',
        'navbar',
        'sidebar',
        'collections',
        'markdown',
      ],
    },
    {
      text: 'Page Configuration',
      prefix: 'frontmatter',
      collapsed: false,
      items: [
        'basic',
        'home',
        'post',
        'friend',
      ],
    },
    {
      text: 'Built-in Plugins',
      prefix: 'plugins',
      collapsed: false,
      items: [
        '',
        'shiki',
        'search',
        'reading-time',
        'markdown-enhance',
        'markdown-power',
        'markdown-image',
        'markdown-math',
        'markdown-include',
        'watermark',
      ],
    },
  ],
})
