import './styles/index.scss'

import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import Badge from './components/global/Badge.vue'
import { setupDarkMode, useScrollPromise } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    // global component
    // eslint-disable-next-line vue/match-component-file-name
    app.component('Badge', Badge)

    // eslint-disable-next-line vue/match-component-file-name
    app.component('DocSearch', () => {
      const SearchComponent =
        app.component('Docsearch') || app.component('SearchBox')
      if (SearchComponent) {
        return h(SearchComponent)
      }
      return null
    })

    // eslint-disable-next-line vue/match-component-file-name
    app.component('PageComment', (props) => {
      const CommentService = app.component('CommentService')
      if (CommentService) {
        return h(CommentService, props)
      }
      return null
    })

    // eslint-disable-next-line vue/match-component-file-name
    app.component('Icon', (props) => {
      const Iconify = app.component('Iconify')
      if (Iconify) {
        return h(Iconify, props)
      }
      return null
    })

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
})
