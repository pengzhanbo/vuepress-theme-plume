import type { Plugin, App } from '@vuepress/core'
{{#if client}}
import path from 'path'
{{/if}}
{{#if shared}}
import type { {{ upperName }}Options } from '../shared'
{{else}}

export interface {{ upperName }}Options {
  a?: string
}
{{/if}}

export const {{ lowerName }}Plugin = (options: {{ upperName }}Options): Plugin => {
  return (app: App) => {
    return {
      name: '@vuepress-plume/vuepress-{{ pkgName }}',
      {{#if client}}
      clientAppEnhanceFiles: path.resolve(
        __dirname,
        '../client/clientAppEnhance.js'
      ),
      {{/if}}
    }
  }
}
