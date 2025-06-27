import type { UnpluginFactory } from 'unplugin'
import type { ReplacementRule } from '../options.js'
import { transformAssets } from './transform.js'
import { createAssetPattern } from './utils.js'

export const unpluginFactory: UnpluginFactory<ReplacementRule[]> = (rules) => {
  const pattern = createAssetPattern('/[^/]')
  return {
    name: 'vuepress:replace-assets',
    enforce: 'pre',
    transform: {
      filter: { id: { exclude: [/\.json(?:$|\?)/, /\.html?$/] } },
      handler(code) {
        return transformAssets(code, pattern, rules)
      },
    },
  }
}
