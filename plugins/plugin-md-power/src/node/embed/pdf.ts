/**
 * @[pdf](/xxx)
 * @[pdf 1](/xxx)
 * @[pdf 1 no-toolbar width="100%" height="600px" zoom="1" ratio="1:1"](/xxx)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { PDFTokenMeta } from '../../shared/index.js'
import { objectKeys } from '@pengzhanbo/utils'
import { path } from 'vuepress/utils'
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

      return {
        src,
        page,
        noToolbar: Boolean(attrs.noToolbar ?? false),
        zoom: +attrs.zoom || 50,
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : '',
        ratio: attrs.ratio ? parseRect(attrs.ratio) : '',
        title: path.basename(src || ''),
      }
    },
    content: meta => `<PDFViewer${stringifyAttrs(meta)} />`,
  })
}
