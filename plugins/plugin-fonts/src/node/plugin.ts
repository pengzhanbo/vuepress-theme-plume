import type { Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'

export function fontsPlugin(): Plugin {
  return {
    name: '@vuepress-plume/plugin-fonts',
    clientConfigFile: path.resolve(
      getDirname(import.meta.url),
      '../client/config.js',
    ),
  }
}
