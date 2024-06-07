import type { App, Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import type { NotesDataOptions } from '../shared/index.js'
import { prepareNotesData, watchNotesData } from './prepareNotesData.js'

export function notesDataPlugin(options: NotesDataOptions | NotesDataOptions[]): Plugin {
  return {
    name: '@vuepress-plume/plugin-notes-data',

    clientConfigFile: path.join(
      getDirname(import.meta.url),
      '../client/clientConfig.js',
    ),

    onPrepared: app => prepareNotesData(app, options),
    onWatched: (app, watchers) => watchNotesData(app, watchers, options),
  }
}
