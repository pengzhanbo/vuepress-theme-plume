import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeConfig: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'config',
  title: 'Config',
  linkPrefix: '/config/',
  sidebar: [
    {
      text: 'Config',
      collapsed: false,
      items: [
        'intro',
        'basic',
        'locales',
        'notes',
      ],
    },
    {
      text: 'frontmatter',
      prefix: 'frontmatter',
      collapsed: false,
      items: [
        'basic',
        'article',
      ],
    },
  ],
})
