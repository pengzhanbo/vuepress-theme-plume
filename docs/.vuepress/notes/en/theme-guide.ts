import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeGuide = defineNoteConfig({
  dir: 'theme/guide',
  link: '/guide/',
  sidebar: [
    {
      text: 'Quick Start',
      collapsed: false,
      icon: 'carbon:idea',
      items: [
        'intro',
      ],
    },
  ],
})
