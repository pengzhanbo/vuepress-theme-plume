import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import Badge from './components/global/Badge.vue'
import { setupDarkMode } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

import './styles/index.scss'

export default defineClientConfig({
  enhance({ app }) {
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
  },
  setup() {
    setupDarkMode()
  },
  layouts: {
    Layout,
    NotFound,
  },
})
