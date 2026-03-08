/**
 * VuePress Client Configuration for Search Plugin
 *
 * 搜索插件的 VuePress 客户端配置
 *
 * Registers the SearchBox component globally and provides locale and option
 * configuration to the search component.
 *
 * 全局注册 SearchBox 组件，并向搜索组件提供语言和选项配置。
 *
 * @module plugin-search/client/config
 */
import type { ClientConfig } from 'vuepress/client'
import type { SearchBoxLocales, SearchOptions } from '../shared/index.js'
import { h } from 'vue'
import { defineClientConfig } from 'vuepress/client'
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
