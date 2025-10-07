import { defineCollections, type ThemeCollections } from 'vuepress-theme-plume'
import { themeConfig } from './theme-config.js'
import { themeGuide } from './theme-guide.js'

export const enCollections: ThemeCollections = defineCollections([
  themeGuide,
  themeConfig,
])
