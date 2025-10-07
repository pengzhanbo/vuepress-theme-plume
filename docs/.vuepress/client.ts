import type { ClientConfig } from 'vuepress/client'
import { defineMermaidConfig } from '@vuepress/plugin-markdown-chart/client'
import { h } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import VPPostItem from 'vuepress-theme-plume/components/Posts/VPPostItem.vue'
import { defineClientConfig } from 'vuepress/client'
import AsideNav from '~/components/AsideNav.vue'
import { setupThemeColors } from '~/composables/theme-colors.js'

defineMermaidConfig({
  class: {
    hideEmptyMembersBox: true,
  },
  look: 'handDrawn',
})

export default defineClientConfig({
  enhance({ app }) {
    app.component('VPPostItem', VPPostItem)
  },
  setup() {
    setupThemeColors()
  },
  layouts: {
    Layout: h(Layout, null, {
      'aside-outline-after': () => h(AsideNav),
    }),
  },
}) as ClientConfig
