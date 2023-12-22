import type { App, Plugin } from '@vuepress/core'
{{#if client}}
import { path } from '@vuepress/utils'
{{/if}}
{{#if shared}}
import type { {{ upperName }}Options } from '../shared/index.js'
{{else}}

export interface {{ upperName }}Options {
  a?: string
}
{{/if}}

export const {{ lowerName }}Plugin = (options: {{ upperName }}Options): Plugin => {
  return (app: App) => {
    return {
      name: '@vuepress-plume/{{ pkgName }}',
      {{#if client}}
      clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
      {{/if}}
    }
  }
}
