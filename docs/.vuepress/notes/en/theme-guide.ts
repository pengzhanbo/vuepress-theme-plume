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
        'quick-start',
        'project-structure',
        'write',
      ],
    },
    {
      text: 'Write',
      icon: 'fluent-mdl2:edit-create',
      collapsed: false,
      items: [
        {
          text: 'markdown',
          icon: 'material-symbols:markdown-outline',
          prefix: 'markdown',
          collapsed: true,
          items: [
            'basic',
            'extensions',
          ],
        },
      ],
    },
  ],
})
