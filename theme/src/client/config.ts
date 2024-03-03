import './styles/index.scss'

import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import Badge from './components/global/Badge.vue'
import ExternalLinkIcon from './components/global/ExternalLinkIcon.vue'
import { setupDarkMode, useScrollPromise } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'
import HomeBox from './components/Home/HomeBox.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    // global component
    app.component('Badge', Badge)

    if (app._context.components.ExternalLinkIcon)
      delete app._context.components.ExternalLinkIcon
    app.component('ExternalLinkIcon', ExternalLinkIcon)

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
    setupDarkMode()
  },
  layouts: {
    Layout,
    NotFound,
  },
}) as ClientConfig
