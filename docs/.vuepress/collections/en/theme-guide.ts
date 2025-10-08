import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeGuide: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'guide',
  title: 'Guide',
  linkPrefix: '/guide/',
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
        {
          text: 'Collection',
          link: 'collection',
          items: ['collection-post', 'collection-doc'],
        },
        'sidebar',
        'write',
        'locales',
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
            'plot',
            'abbr',
            'annotation',
            'card',
            'steps',
            'file-tree',
            'code-tree',
            'field',
            'tabs',
            'timeline',
            'demo-wrapper',
            'flex',
            'collapse',
            'npm-to',
            'caniuse',
            'chat',
            'include',
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
