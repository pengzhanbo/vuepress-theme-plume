import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeConfig: ThemeCollectionItem = defineCollection({
  type: 'doc',
  title: '配置',
  dir: 'config',
  linkPrefix: '/config/',
  sidebar: [
    {
      text: '配置',
      collapsed: false,
      items: [
        'intro',
        'theme',
        'locales',
        'navbar',
        'notes',
        'sidebar',
        'markdown',
      ],
    },
    {
      text: '页面配置',
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
      text: '内置插件',
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
