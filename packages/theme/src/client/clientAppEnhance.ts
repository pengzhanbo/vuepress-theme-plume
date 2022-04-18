import { defineClientAppEnhance } from '@vuepress/client'

import './styles/index.scss'

export default defineClientAppEnhance(({ app }) => {
  app.component('NavbarSearch', () => {
    const SearchComponent =
      app.component('Docsearch') || app.component('SearchBox')
    if (SearchComponent) {
      return SearchComponent
    }
    return null
  })
})
