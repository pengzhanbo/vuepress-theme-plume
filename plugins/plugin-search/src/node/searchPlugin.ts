import type { Plugin } from 'vuepress/core'
import type { SearchPluginOptions } from '../shared/index.js'
import { addViteOptimizeDepsInclude, getFullLocaleConfig } from '@vuepress/helper'
import chokidar from 'chokidar'
import { getDirname, path } from 'vuepress/utils'
import { SEARCH_LOCALES } from './locales/index.js'
import { onSearchIndexRemoved, onSearchIndexUpdated, prepareSearchIndex, prepareSearchIndexPlaceholder } from './prepareSearchIndex.js'

const __dirname = getDirname(import.meta.url)

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
        const placeholder = prepareSearchIndexPlaceholder(app)
        await placeholder
        placeholder.then(() => prepareSearchIndex({ app, isSearchable, searchOptions }))
      }
    },

    onWatched: (app, watchers) => {
      const searchIndexWatcher = chokidar.watch('pages', {
        cwd: app.dir.temp(),
        ignoreInitial: true,
        ignored: (filepath, stats) => Boolean(stats?.isFile()) && !filepath.endsWith('.js'),
      })
      searchIndexWatcher.on('add', (filepath) => {
        onSearchIndexUpdated(filepath, { app, isSearchable, searchOptions })
      })
      searchIndexWatcher.on('change', (filepath) => {
        onSearchIndexUpdated(filepath, { app, isSearchable, searchOptions })
      })
      searchIndexWatcher.on('unlink', (filepath) => {
        onSearchIndexRemoved(filepath, { app, isSearchable, searchOptions })
      })
      watchers.push(searchIndexWatcher)
    },
  })
}
