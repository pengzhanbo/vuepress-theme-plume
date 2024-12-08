import { defineNotesConfig } from 'vuepress-theme-plume'
import { themeGuide } from './theme-guide.js'

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/',
  notes: [themeGuide],
})
