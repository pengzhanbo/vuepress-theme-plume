import type { Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export function contentUpdatePlugin(): Plugin {
  return {
    name: '@vuepress-plume/plugin-content-update',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
  }
}
