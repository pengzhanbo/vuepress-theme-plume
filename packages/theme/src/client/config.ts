import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import Badge from './components/global/Badge.vue'
import { setupDarkMode, useScrollPromise } from './composables'

import './styles/index.scss'

export default defineClientConfig({
  enhance({ app, router }) {
    // eslint-disable-next-line vue/match-component-file-name
    app.component('Badge', Badge)

    // eslint-disable-next-line vue/match-component-file-name
    app.component('NavbarSearch', () => {
      const SearchComponent =
        app.component('Docsearch') || app.component('SearchBox')
      if (SearchComponent) {
        return h(SearchComponent)
      }
      return null
    })
    // eslint-disable-next-line vue/match-component-file-name
    app.component('Comment', (props) => {
      const CommentService = app.component('CommentService')
      if (CommentService) {
        return h(CommentService, props)
      }
      return null
    })

    const scrollBehavior = router.options.scrollBehavior!
    router.options.scrollBehavior = async (...args) => {
      await useScrollPromise().wait()
      return scrollBehavior(...args)
    }
  },
  setup() {
    setupDarkMode()
  },
})
