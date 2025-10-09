import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const tools: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'tools',
  title: 'Theme Tools',
  linkPrefix: '/tools/',
  sidebar: [
    {
      text: 'Tools',
      icon: 'tabler:tools',
      items: [
        'custom-theme',
        'home-hero-tint-plate',
        'caniuse',
      ],
    },
  ],
})
