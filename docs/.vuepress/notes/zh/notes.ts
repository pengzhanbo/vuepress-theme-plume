import { defineNoteConfig } from 'vuepress-theme-plume'

export const notes = defineNoteConfig({
  dir: 'notes',
  link: '/article/',
  sidebar: [
    {
      text: '《论语》之礼乐',
      collapsed: false,
      prefix: '《论语》之“礼乐”',
      items: 'auto',
    },
  ],
})
