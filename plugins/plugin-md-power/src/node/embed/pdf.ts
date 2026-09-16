/**
 * @[pdf](/xxx)
 * @[pdf page="1"](/xxx)
 * @[pdf width="100%" height="600px" ratio="1:1"](/xxx)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { PDFTokenMeta } from '../../shared/index.js'
import { objectKeys } from '@pengzhanbo/utils'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from './createEmbedRuleBlock.js'

const RE_PAGE = /^\d+$/

export const pdfPlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<PDFTokenMeta>(md, {
    type: 'pdf',
    meta(info, src) {
      const attrs = resolveAttrs(info)
      let page: number = 1
      objectKeys(attrs).forEach((key) => {
        if (RE_PAGE.test(key)) {
          page = +key
        }
      })

      // `page="2"` takes precedence over the numeric shorthand `@[pdf 2]`
      // `page="2"` 优先于数字简写 `@[pdf 2]`
      if (attrs.page && RE_PAGE.test(String(attrs.page)))
        page = +attrs.page

      return {
        src,
        page,
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : undefined,
        ratio: attrs.ratio ? parseRect(attrs.ratio) : undefined,
      }
    },
    content: meta => `<VPPdf${stringifyAttrs(meta)} />`,
  })
}
