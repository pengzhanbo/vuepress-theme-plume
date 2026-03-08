/**
 * VuePress Search Plugin - Node Side Entry
 *
 * VuePress 搜索插件 - Node 端入口
 *
 * Exports the search plugin and search index preparation utilities.
 *
 * 导出搜索插件和搜索索引准备工具。
 *
 * @module plugin-search/node
 */
export * from '../shared/index.js'
export { prepareSearchIndex } from './prepareSearchIndex.js'
export { searchPlugin } from './searchPlugin.js'
