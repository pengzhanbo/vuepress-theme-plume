import { defineCollections, type ThemeCollections } from 'vuepress-theme-plume'
import { themeConfig } from './theme-config.js'
import { themeGuide } from './theme-guide.js'
import { tools } from './tools.js'

export const zhCollections: ThemeCollections = defineCollections([
  themeGuide,
  themeConfig,
  tools,
])
