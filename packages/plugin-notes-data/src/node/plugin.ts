import type { App, Plugin } from '@vuepress/core'
import { path } from '@vuepress/utils'
import type { NotesDataOptions } from '../shared/index.js'

export const notesDataPlugin = (options: NotesDataOptions): Plugin => {
  return (app: App) => {
    return {
      name: '@vuepress-plume/vuepress-plugin-notes-data',
      clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
    }
  }
}
