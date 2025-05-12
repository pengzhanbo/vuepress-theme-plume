import type { ThemeNoteListOptions } from 'vuepress-theme-plume'
import { defineNotesConfig } from 'vuepress-theme-plume'
// import { plugins } from './plugins'
import { themeConfig } from './theme-config'
import { themeGuide } from './theme-guide'
import { tools } from './tools'

export const zhNotes: ThemeNoteListOptions = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    themeGuide,
    themeConfig,
    // plugins,
    tools,
  ],
})
