import './styles/index.css'

import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import Badge from './components/global/Badge.vue'
import { setupDarkMode, setupWatermark, useScrollPromise } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'
import HomeBox from './components/Home/HomeBox.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    setupDarkMode(app)
    // global component
    app.component('Badge', Badge)

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

    app.component('HomeBox', HomeBox)

    // handle scrollBehavior with transition
    const scrollBehavior = router.options.scrollBehavior!
    router.options.scrollBehavior = async (...args) => {
      await useScrollPromise().wait()
      return scrollBehavior(...args)
    }
  },
  setup() {
    setupWatermark()
  },
  layouts: {
    Layout,
    NotFound,
  },
}) as ClientConfig
