import type { App, Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { NotesDataOptions } from '../shared/index.js'
import { prepareNotesData, watchNotesData } from './prepareNotesData.js'

export const notesDataPlugin = (options: NotesDataOptions): Plugin => {
  return (app: App) => {
    return {
      name: '@vuepress-plume/plugin-notes-data',
      clientConfigFile: path.resolve(
        getDirname(import.meta.url),
        '../client/clientConfig.js'
      ),
      onPrepared: () => prepareNotesData(app, options),
      onWatched: (app, watchers) => watchNotesData(app, watchers, options),
    }
  }
}
