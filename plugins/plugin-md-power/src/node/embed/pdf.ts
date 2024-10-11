/**
 * @[pdf](/xxx)
 * @[pdf 1](/xxx)
 * @[pdf 1 no-toolbar width="100%" height="600px" zoom="1" ratio="1:1"](/xxx)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { PDFTokenMeta } from '../../shared/index.js'
import { path } from 'vuepress/utils'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { createEmbedRuleBlock } from './createEmbedRuleBlock.js'

export const pdfPlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<PDFTokenMeta>(md, {
    type: 'pdf',
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    syntaxPattern: /^@\[pdf(?:\s+(\d+))?([^\]]*)\]\(([^)]*)\)/,
    meta([, page, info, src]) {
      const { attrs } = resolveAttrs(info)
      return {
        src,
        page: +page || 1,
        noToolbar: Boolean(attrs.noToolbar ?? false),
        zoom: +attrs.zoom || 50,
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : '',
        ratio: attrs.ratio ? parseRect(attrs.ratio) : '',
        title: path.basename(src || ''),
      }
    },
    content({ title, src, page, noToolbar, width, height, ratio, zoom }) {
      return `<PDFViewer src="${src}" title="${title}" :page="${page}" :no-toolbar="${noToolbar}" width="${width}" height="${height}" ratio="${ratio}" :zoom="${zoom}" />`
    },
  })
}
