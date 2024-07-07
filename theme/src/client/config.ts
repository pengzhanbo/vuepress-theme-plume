import './styles/index.css'

import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { enhanceScrollBehavior, setupDarkMode, setupSidebar, setupThemeData, setupWatermark } from './composables/index.js'
import { globalComponents } from './globalComponents.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    setupThemeData(app)
    setupDarkMode(app)
    enhanceScrollBehavior(router)
    globalComponents(app)
  },
  setup() {
    setupSidebar()
    setupWatermark()
  },
  layouts: { Layout, NotFound },
}) as ClientConfig
