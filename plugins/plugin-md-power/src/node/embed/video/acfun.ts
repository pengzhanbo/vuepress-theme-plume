/**
 * @[acfun](acid)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { AcFunTokenMeta } from '../../../shared/index.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { stringifyAttrs } from '../../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

const AC_FUN_LINK = 'https://www.acfun.cn/player'

export const acfunPlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<AcFunTokenMeta>(md, {
    type: 'acfun',
    name: 'video_acfun',
    syntaxPattern: /^@\[acfun([^\]]*)\]\(([^)]*)\)/,
    meta([, info, id]) {
      const { attrs } = resolveAttrs(info)

      return {
        id,
        title: attrs.title || 'AcFun',
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : undefined,
        ratio: attrs.ratio ?? '16:10',
      }
    },
    content(meta) {
      const { id, width, height, ratio, title } = meta
      const src = `${AC_FUN_LINK}/${id}`
      return `<VPVideoEmbed${stringifyAttrs({ src, width, height, ratio, title, type: 'acfun' })} />`
    },
  })
}
