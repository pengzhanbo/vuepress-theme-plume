import { defineNotesConfig } from 'vuepress-theme-plume'
import { examples } from './examples'
import { notes } from './notes'
// import { plugins } from './plugins'
import { themeConfig } from './theme-config'
import { themeGuide } from './theme-guide'
import { tools } from './tools'

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    themeGuide,
    themeConfig,
    // plugins,
    tools,
    notes,
    examples,
  ],
})
