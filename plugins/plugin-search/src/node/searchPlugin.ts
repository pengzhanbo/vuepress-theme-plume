import type { Plugin } from 'vuepress/core'
import type { SearchPluginOptions } from '../shared/index.js'
import { addViteOptimizeDepsInclude, getFullLocaleConfig } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'
import { SEARCH_LOCALES } from './locales/index.js'
import { onSearchIndexRemoved, onSearchIndexUpdated, prepareSearchIndex, prepareSearchIndexPlaceholder } from './prepareSearchIndex.js'

const __dirname = getDirname(import.meta.url)

/**
 * Create a VuePress search plugin instance.
 *
 * 创建 VuePress 搜索插件实例。
 *
 * @param options - Plugin configuration options / 插件配置选项
 * @param options.locales - Locale-specific search configurations / 特定语言的搜索配置
 * @param options.isSearchable - Function to determine if a page should be indexed / 判断页面是否应被索引的函数
 * @param options.searchOptions - MiniSearch options / MiniSearch 配置选项
 * @returns VuePress plugin object / VuePress 插件对象
 * @example
 * // Basic usage
 * export default {
 *   plugins: [
 *     searchPlugin()
 *   ]
 * }
 *
 * // With custom options
 * export default {
 *   plugins: [
 *     searchPlugin({
 *       locales: {
 *         '/zh/': { placeholder: '搜索文档' }
 *       },
 *       isSearchable: (page) => page.path !== '/secret/'
 *     })
 *   ]
 * }
 */
export function searchPlugin({
  locales = {},
  isSearchable,
  ...searchOptions
}: SearchPluginOptions = {}): Plugin {
  return app => ({
    name: '@vuepress-plume/plugin-search',

    clientConfigFile: path.resolve(__dirname, '../client/config.js'),

    define: {
      __SEARCH_LOCALES__: getFullLocaleConfig({
        app,
        name: '@vuepress-plume/plugin-search',
        default: SEARCH_LOCALES,
        config: locales,
      }),
      __SEARCH_OPTIONS__: searchOptions,
    },

    extendsBundlerOptions(bundlerOptions) {
      addViteOptimizeDepsInclude(bundlerOptions, app, ['mark.js/src/vanilla.js', '@vueuse/integrations/useFocusTrap', 'minisearch'])
    },

    onPrepared: async (app) => {
      if (app.env.isBuild) {
        await prepareSearchIndex({ app, isSearchable, searchOptions })
      }
      else {
        await prepareSearchIndexPlaceholder(app)
        prepareSearchIndex({ app, isSearchable, searchOptions })
      }
    },

    onPageUpdated: (app, type, page) => {
      if (!page?.filePathRelative)
        return

      if (type === 'create' || type === 'update') {
        onSearchIndexUpdated(page?.filePathRelative, { app, isSearchable, searchOptions })
      }
      else if (type === 'delete') {
        onSearchIndexRemoved(page?.filePathRelative, { app, isSearchable, searchOptions })
      }
    },

    // onWatched: (app, watchers) => {
    //   const searchIndexWatcher = chokidar.watch('pages', {
    //     cwd: app.dir.temp(),
    //     ignoreInitial: true,
    //     ignored: (filepath, stats) => Boolean(stats?.isFile()) && !filepath.endsWith('.js'),
    //   })
    //   searchIndexWatcher.on('add', (filepath) => {
    //     onSearchIndexUpdated(filepath, { app, isSearchable, searchOptions })
    //   })
    //   searchIndexWatcher.on('change', (filepath) => {
    //     onSearchIndexUpdated(filepath, { app, isSearchable, searchOptions })
    //   })
    //   searchIndexWatcher.on('unlink', (filepath) => {
    //     onSearchIndexRemoved(filepath, { app, isSearchable, searchOptions })
    //   })
    //   watchers.push(searchIndexWatcher)
    // },
  })
}
