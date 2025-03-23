import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeGuide = defineNoteConfig({
  dir: 'theme/guide',
  link: '/guide/',
  sidebar: [
    {
      text: 'Quick Start',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'quick-start',
      items: [
        'intro',
        'usage',
        'project-structure',
        'write',
        'blog',
        'document',
        'international',
        'deployment',
        'optimize-build',
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
            'icons',
            'mark',
          ],
        },
      ],
    },
    {
      text: 'Customization',
      icon: 'material-symbols:dashboard-customize-outline-rounded',
      collapsed: false,
      prefix: 'custom',
      items: [
        'home',
        'style',
      ],
    },
  ],
})
