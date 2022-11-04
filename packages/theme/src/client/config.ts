import { defineClientConfig } from '@vuepress/client'
import { setupDarkMode } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

import './styles/index.scss'

export default defineClientConfig({
  setup() {
    setupDarkMode()
  },
  layouts: {
    Layout,
    NotFound,
  },
})
