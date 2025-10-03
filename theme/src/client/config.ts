import type { ClientConfig } from 'vuepress/client'
import { defineClientConfig } from 'vuepress/client'
import {
  enhanceScrollBehavior,
  setupCollection,
  setupDarkMode,
  setupEncrypt,
  setupHeaders,
  setupSidebar,
  setupThemeData,
  setupWatermark,
} from './composables/index.js'
import { globalComponents } from './globalComponents.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

import './styles/index.css'

export default defineClientConfig({
  enhance({ app, router }) {
    setupThemeData(app)
    setupDarkMode(app)
    enhanceScrollBehavior(router)
    globalComponents(app)
  },
  setup() {
    setupCollection()
    setupSidebar()
    setupHeaders()
    setupEncrypt()
    setupWatermark()
  },
  layouts: { Layout, NotFound },
}) as ClientConfig
