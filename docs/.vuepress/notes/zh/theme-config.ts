import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeConfig = defineNoteConfig({
  dir: 'theme/config',
  link: '/config/',
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
      ],
    },
    {
      text: 'frontmatter',
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
