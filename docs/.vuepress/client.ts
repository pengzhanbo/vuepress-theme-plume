import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import { defineClientConfig } from 'vuepress/client'
import AsideNav from '~/components/AsideNav.vue'
import { setupThemeColors } from '~/composables/theme-colors.js'

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
