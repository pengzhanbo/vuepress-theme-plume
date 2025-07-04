import type { ThemeNote } from 'vuepress-theme-plume'
import { defineNoteConfig } from 'vuepress-theme-plume'

export const tools: ThemeNote = defineNoteConfig({
  dir: 'tools',
  link: '/tools/',
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
