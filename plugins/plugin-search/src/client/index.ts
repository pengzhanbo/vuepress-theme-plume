/**
 * VuePress Search Plugin - Client Side Entry
 *
 * VuePress 搜索插件 - 客户端入口
 *
 * Exports the SearchBox component and search index composable for use in
 * VuePress theme components.
 *
 * 导出 SearchBox 组件和搜索索引组合式函数，供 VuePress 主题组件使用。
 *
 * @module plugin-search/client
 */
import SearchBox from './components/Search.vue'
import { useSearchIndex } from './composables/index.js'

export {
  SearchBox,
  useSearchIndex,
}
