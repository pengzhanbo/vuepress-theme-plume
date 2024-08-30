import { defineNotesConfig } from 'vuepress-theme-plume'
import { themeGuide } from './theme-guide'
import { themeConfig } from './theme-config'
import { plugins } from './plugins'
import { tools } from './tools'

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    themeGuide,
    themeConfig,
    plugins,
    tools,
  ],
})
