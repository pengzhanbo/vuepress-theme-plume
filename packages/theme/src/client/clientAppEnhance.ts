import { defineClientAppEnhance } from '@vuepress/client'
import type { Component } from 'vue'
import { h } from 'vue'
import { useScrollPromise } from './composables'

import './styles/index.scss'

export default defineClientAppEnhance(({ app, router }) => {
  app.component('NavbarSearch', () => {
    const SearchComponent = (app.component('Docsearch') ||
      app.component('SearchBox')) as Component
    if (SearchComponent) {
      return h(SearchComponent)
    }
    return null
  })

  const scrollBehavior = router.options.scrollBehavior!
  router.options.scrollBehavior = async (...args) => {
    await useScrollPromise().wait()
    return scrollBehavior(...args)
  }
})
