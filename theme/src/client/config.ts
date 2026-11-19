import type { ClientConfig } from 'vuepress/client'
import { defineClientConfig } from 'vuepress/client'
import {
  setupCollection,
  setupDarkMode,
  setupEncrypt,
  setupHeaders,
  setupLinkPreview,
  setupReaderPreferences,
  setupScrollRestoration,
  setupSidebar,
  setupThemeData,
  setupWatermark,
} from './composables/index.js'
import { globalComponents } from './globalComponents.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

import './styles/index.css'

export default defineClientConfig({
  enhance({ app }) {
    setupThemeData(app)
    setupDarkMode(app)
    globalComponents(app)
  },
  setup() {
    setupScrollRestoration()
    setupCollection()
    setupSidebar()
    setupHeaders()
    setupEncrypt()
    setupReaderPreferences()
    setupWatermark()
    setupLinkPreview()
  },
  layouts: { Layout, NotFound },
}) as ClientConfig
