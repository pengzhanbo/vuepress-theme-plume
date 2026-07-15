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
        'fonts',
        'reading-time',
        'llms',
        // 'markdown-enhance', // 已弃用，功能已拆分到 markdown-power 等独立插件
        'markdown-power',
        'markdown-image',
        'markdown-math',
        'markdown-include',
        'watermark',
      ],
    },
  ],
})
