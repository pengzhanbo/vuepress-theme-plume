import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const demoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: ['', 'foo', 'bar'],
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [demoNote],
})
