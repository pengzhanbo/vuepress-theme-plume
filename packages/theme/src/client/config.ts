import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import { setupDarkMode } from './composables/index.js'
import Layout from './layouts/Layout.vue'
import NotFound from './layouts/NotFound.vue'

import './styles/index.scss'

export default defineClientConfig({
  enhance({ app }) {
    // eslint-disable-next-line vue/match-component-file-name
    app.component('NavbarSearch', () => {
      const SearchComponent =
        app.component('Docsearch') || app.component('SearchBox')
      if (SearchComponent) {
        return h(SearchComponent)
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
