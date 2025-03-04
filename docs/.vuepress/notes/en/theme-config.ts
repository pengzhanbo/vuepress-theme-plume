import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeConfig = defineNoteConfig({
  dir: 'theme/config',
  link: '/config/',
  sidebar: [
    {
      text: 'Config',
      collapsed: false,
      items: [
        'intro',
        'basic',
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
