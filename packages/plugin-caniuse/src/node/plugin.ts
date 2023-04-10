import type { Plugin, PluginObject } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type Token from 'markdown-it/lib/token.js'
import container from 'markdown-it-container'
import type { CanIUseMode, CanIUsePluginOptions } from '../shared/index.js'
import { resolveCanIUse } from './resolveCanIUse.js'

const __dirname = getDirname(import.meta.url)
const modeMap: CanIUseMode[] = ['image', 'embed']
const isMode = (mode: CanIUseMode): boolean => modeMap.includes(mode)

export const caniusePlugin = ({
  mode = modeMap[0],
}: CanIUsePluginOptions): Plugin => {
  mode = isMode(mode) ? mode : modeMap[0]
  const type = 'caniuse'
  const validateReg = new RegExp(`^${type}\\s+(.*)$`)
  const pluginObj: PluginObject = {
    name: '@vuepress-plume/vuepress-plugin-caniuse',
    clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
    define: {
      __CAN_I_USE_INJECT_MODE__: mode,
    },
  }

  const validate = (info: string): boolean => {
    return validateReg.test(info.trim())
  }

  const before = '<div class="caniuse-container">\n'
  const after = '\n</div>'

  const render = (tokens: Token[], index: number): string => {
    const token = tokens[index]
    if (token.nesting === 1) {
      const feature = token.info.trim().slice(type.length).trim() || ''
      if (feature) {
        return before + resolveCanIUse(feature, mode)
      }
      return before
    } else {
      return after
    }
  }

  pluginObj.extendsMarkdown = (md) => {
    md.use(container, type, { validate, render })
  }

  return pluginObj
}
