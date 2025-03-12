import { defineNotesConfig } from 'vuepress-theme-plume'
import { themeConfig } from './theme-config'
import { themeGuide } from './theme-guide'

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/',
  notes: [
    themeGuide,
    themeConfig,
  ],
})
