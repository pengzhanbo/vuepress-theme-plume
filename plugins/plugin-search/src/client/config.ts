import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { h } from 'vue'
import type { SearchBoxLocales, SearchOptions } from '../shared/index.js'
import Search from './components/Search.vue'

declare const __SEARCH_LOCALES__: SearchBoxLocales
declare const __SEARCH_OPTIONS__: SearchOptions

const locales = __SEARCH_LOCALES__
const searchOptions = __SEARCH_OPTIONS__

export default defineClientConfig({
  enhance({ app }) {
    app.component('SearchBox', props => h(Search, {
      locales,
      options: searchOptions,
      ...props,
    }))
  },
}) as ClientConfig
