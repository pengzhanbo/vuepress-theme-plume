import './styles/index.css'

import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import VPCard from '@theme/global/VPCard.vue'
import VPBadge from '@theme/global/VPBadge.vue'
import VPCardGrid from '@theme/global/VPCardGrid.vue'
import { enhanceScrollBehavior, setupDarkMode, setupWatermark } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    setupDarkMode(app)
    enhanceScrollBehavior(router)

    // global component
    app.component('Badge', VPBadge)
    app.component('VPBadge', VPBadge) // alias

    app.component('VPCard', VPCard)
    app.component('Card', VPCard)

    app.component('VPCardGrid', VPCardGrid)
    app.component('CardGrid', VPCardGrid)

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
