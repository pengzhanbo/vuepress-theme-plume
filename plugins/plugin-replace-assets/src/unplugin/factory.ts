import type { UnpluginFactory, UnpluginOptions } from 'unplugin'
import type { ReplacementRule } from '../options.js'
import { transformAssets } from './transform.js'
import { createAssetPattern, isHTMLRequest, isNonJsRequest } from './utils.js'

export const unpluginFactory: UnpluginFactory<ReplacementRule[]> = (rules) => {
  const plugins: UnpluginOptions[] = []

  if (rules.length) {
    plugins.push({
      name: 'vuepress:replace-assets',
      enforce: 'pre',
      transformInclude(id: string) {
        if (isHTMLRequest(id) || isNonJsRequest(id))
          return false
        return true
      },
      transform(code) {
        return {
          code: transformAssets(
            code,
            createAssetPattern('/[^/]'),
            rules,
          ),
        }
      },
    })
  }

  return plugins
}
