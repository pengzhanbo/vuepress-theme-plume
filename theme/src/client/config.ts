import './styles/index.css'

import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import VPBadge from './components/global/VPBadge.vue'
import { enhanceScrollBehavior, setupDarkMode, setupWatermark } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'
import VPHomeBox from './components/Home/VPHomeBox.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    setupDarkMode(app)
    enhanceScrollBehavior(router)

    // global component
    app.component('Badge', VPBadge)
    app.component('VPBadge', VPBadge) // alias

    app.component('DocSearch', () => {
      const SearchComponent
        = app.component('Docsearch') || app.component('SearchBox')
      if (SearchComponent)
        return h(SearchComponent)

      return null
    })

    app.component('PageComment', (props) => {
      const CommentService = app.component('CommentService')
      if (CommentService)
        return h(CommentService, props)

      return null
    })

    app.component('Icon', (props) => {
      const Iconify = app.component('Iconify')
      if (Iconify)
        return h(Iconify, props)

      return null
    })

    /** @deprecated */
    app.component('HomeBox', VPHomeBox)
    app.component('VPHomeBox', VPHomeBox)
  },
  setup() {
    setupWatermark()
  },
  layouts: {
    Layout,
    NotFound,
  },
}) as ClientConfig
