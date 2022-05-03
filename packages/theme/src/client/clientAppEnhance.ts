import { defineClientAppEnhance } from '@vuepress/client'
import { h } from 'vue'
import Badge from './components/global/Badge.vue'
import { useScrollPromise } from './composables'

import './styles/index.scss'

export default defineClientAppEnhance(({ app, router }) => {
  app.component('Badge', Badge)

  app.component('NavbarSearch', () => {
    const SearchComponent =
      app.component('Docsearch') || app.component('SearchBox')
    if (SearchComponent) {
      return h(SearchComponent)
    }
    return null
  })

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
})
