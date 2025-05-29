import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import { defineMermaidConfig } from 'vuepress-plugin-md-enhance/client'
import { Layout } from 'vuepress-theme-plume/client'
import { defineClientConfig } from 'vuepress/client'
import AsideNav from '~/components/AsideNav.vue'
import { setupThemeColors } from '~/composables/theme-colors.js'

defineMermaidConfig({
  theme: 'default',
  themeVariables: isDarkMode => ({
    dark: isDarkMode,
    background: isDarkMode ? '#1e1e1e' : '#fff',

    primaryColor: isDarkMode ? '#c8abfa' : '#6f42c1',
    primaryBorderColor: isDarkMode ? '#669' : '#99c',
    primaryTextColor: isDarkMode ? '#c8abfa' : '#6f42c1',

    secondaryColor: '#ffb500',
    secondaryBorderColor: isDarkMode ? '#fff' : '#000',
    secondaryTextColor: isDarkMode ? '#ddd' : '#333',

    tertiaryColor: isDarkMode ? '#282828' : '#efeef4',
    tertiaryBorderColor: isDarkMode ? '#bbb' : '#242424',
    tertiaryTextColor: isDarkMode ? '#ddd' : '#333',

    // Note
    noteBkgColor: isDarkMode ? '#c96' : '#fff5ad',
    noteTextColor: '#242424',
    noteBorderColor: isDarkMode ? '#c86' : '#333',

    lineColor: isDarkMode ? '#d3d3d3' : '#333',
    textColor: isDarkMode ? '#d3d3d3' : '#242424',

    mainBkg: isDarkMode ? 'rgb(159 122 234 / 0.16)' : 'rgb(159 122 234 / 0.14)',
    errorBkgColor: '#eb4d5d',
    errorTextColor: '#fff',

    // Flowchart
    nodeBorder: isDarkMode ? '#669' : '#99c',
    nodeTextColor: isDarkMode ? '#c8abfa' : '#6f42c1',
    edgeLabelBackground: isDarkMode ? '#333' : '#ddd',

    // Sequence
    signalTextColor: isDarkMode ? '#9e9e9e' : '#242424',

    // Class
    classText: '#fff',

    // State
    labelColor: '#fff',

    attributeBackgroundColorEven: isDarkMode ? '#0d1117' : '#fff',
    attributeBackgroundColorOdd: isDarkMode ? '#161b22' : '#f8f8f8',

  }),
  class: {
    hideEmptyMembersBox: true,
  },
  look: 'handDrawn',
})

export default defineClientConfig({
  setup() {
    setupThemeColors()
  },
  layouts: {
    Layout: h(Layout, null, {
      'aside-outline-after': () => h(AsideNav),
    }),
  },
}) as ClientConfig
