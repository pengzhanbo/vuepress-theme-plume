import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeConfig = defineNoteConfig({
  dir: 'theme/config',
  link: '/config/',
  sidebar: [
    {
      text: 'Config',
      collapsed: false,
      items: [
        'basic',
        'intro',
        'notes',
      ],
    },
    {
      text: 'frontmatter',
      prefix: 'frontmatter',
      collapsed: false,
      items: [
        'article',
      ],
    },
  ],
})
