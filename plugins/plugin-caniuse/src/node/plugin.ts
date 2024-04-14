import type { Plugin, PluginObject } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import type Token from 'markdown-it/lib/token.mjs'
import container from 'markdown-it-container'
import type { CanIUseMode, CanIUsePluginOptions } from '../shared/index.js'
import { resolveCanIUse } from './resolveCanIUse.js'

const __dirname = getDirname(import.meta.url)
const modeMap: CanIUseMode[] = ['image', 'embed']
const isMode = (mode: CanIUseMode): boolean => modeMap.includes(mode)

export function caniusePlugin({
  mode = modeMap[0],
}: CanIUsePluginOptions): Plugin {
  mode = isMode(mode) ? mode : modeMap[0]
  const type = 'caniuse'
  const validateReg = new RegExp(`^${type}\\s+(.*)$`)
  const pluginObj: PluginObject = {
    name: '@vuepress-plume/plugin-caniuse',
    clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
    define: {
      __CAN_I_USE_INJECT_MODE__: mode,
    },
  }

  const validate = (info: string): boolean => {
    return validateReg.test(info.trim())
  }

  const render = (tokens: Token[], index: number): string => {
    const token = tokens[index]
    if (token.nesting === 1) {
      const info = token.info.trim().slice(type.length).trim() || ''
      const feature = info.split(/\s+/)[0]
      const versions = info.match(/\{(.*)\}/)?.[1] || ''
      return feature ? resolveCanIUse(feature, mode, versions) : ''
    }
    else {
      return ''
    }
  }

  pluginObj.extendsMarkdown = (md) => {
    md.use(container, type, { validate, render })
  }

  return pluginObj
}
