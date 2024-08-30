import { defineNoteConfig } from 'vuepress-theme-plume'

export const tools = defineNoteConfig({
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
