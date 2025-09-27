import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const tools: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'tools',
  title: '工具',
  linkPrefix: '/tools/',
  sidebar: [
    {
      text: '工具',
      icon: 'tabler:tools',
      items: [
        'custom-theme',
        'home-hero-tint-plate',
        'caniuse',
      ],
    },
  ],
})
