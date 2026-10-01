import type { Plugin } from 'vuepress/core'
import type { SearchPluginOptions } from '../shared/index.js'
import { addViteOptimizeDepsInclude, getFullLocaleConfig } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'
import { SEARCH_LOCALES } from './locales/index.js'
import { onSearchIndexRemoved, onSearchIndexUpdated, prepareSearchIndex, prepareSearchIndexInBackground, prepareSearchIndexPlaceholder } from './prepareSearchIndex.js'

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
        prepareSearchIndexInBackground({ app, isSearchable, searchOptions })
      }
    },

    // 开发模式下增量更新搜索索引，避免修改文档后必须重启 dev server。
    // Incrementally update the search index in dev so edits take effect without a restart.
    onPageUpdated: async (app, type, pageNew, pageOld) => {
      // VuePress 对 `delete` 事件传入的页面在第四个参数（第三个为 null）。
      // For the `delete` event the removed page is the 4th argument (the 3rd is null).
      if (type === 'delete') {
        if (pageOld?.filePathRelative)
          await onSearchIndexRemoved(app, { page: pageOld, isSearchable, searchOptions })
        return
      }

      // 页面从「可搜索」变为「不可搜索」时，旧索引必须用旧页面清理，
      // 否则 onSearchIndexUpdated 会直接跳过，已排除的页面仍残留在搜索结果中。
      // When a page turns unsearchable, its existing index must be removed using the
      // old page; otherwise onSearchIndexUpdated returns early and leaves stale results.
      const becameUnsearchable = !!isSearchable && !!pageNew && !isSearchable(pageNew)
      const page = becameUnsearchable ? pageOld : pageNew
      if (!page?.filePathRelative)
        return

      if (becameUnsearchable)
        await onSearchIndexRemoved(app, { page, isSearchable, searchOptions })
      else
        await onSearchIndexUpdated(app, { page, isSearchable, searchOptions })
    },
  })
}
