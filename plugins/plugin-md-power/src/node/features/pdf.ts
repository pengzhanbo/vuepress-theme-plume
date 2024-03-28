/**
 * @[pdf](/xxx)
 * @[pdf 1](/xxx)
 * @[pdf 1 no-toolbar width="100%" height="600px" zoom="1" ratio="1:1"](/xxx)
 */
import { path } from 'vuepress/utils'
import type { PluginWithOptions, Token } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.js'
import type { PDFTokenMeta } from '../../shared/pdf.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { parseRect } from '../utils/parseRect.js'

// @[pdf]()
const MIN_LENGTH = 8

// char codes of `@[pdf`
const START_CODES = [64, 91, 112, 100, 102]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[pdf(?:\s+(\d+))?(?:\s+([^]*?))?\]\(([^)]*?)\)/

function createPDFRuleBlock(): RuleBlock {
  return (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // return false if the length is shorter than min length
    if (pos + MIN_LENGTH > max)
      return false

    // check if it's matched the start
    for (let i = 0; i < START_CODES.length; i += 1) {
      if (state.src.charCodeAt(pos + i) !== START_CODES[i])
        return false
    }

    // check if it's matched the syntax
    const match = state.src.slice(pos, max).match(SYNTAX_RE)
    if (!match)
      return false

    // return true as we have matched the syntax
    if (silent)
      return true

    const [, page, info = '', src] = match

    const { attrs } = resolveAttrs(info)

    const meta: PDFTokenMeta = {
      src,
      page: +page || 1,
      noToolbar: Boolean(attrs.noToolbar ?? false),
      zoom: +attrs.zoom || 1,
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '',
      ratio: attrs.ratio ? parseRect(attrs.ratio) : '',
      title: path.basename(src || ''),
    }

    const token = state.push('pdf', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = info

    state.line = startLine + 1

    return true
  }
}

function resolvePDF(meta: PDFTokenMeta): string {
  const { title, src, page, noToolbar, width, height, ratio, zoom } = meta

  return `<PDFViewer src="${src}" title="${title}" :page="${page}" :no-toolbar="${noToolbar}" width="${width}" height="${height}" ratio="${ratio}" :zoom="${zoom}" />`
}

export const pdfPlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'pdf',
    createPDFRuleBlock(),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.pdf = (tokens, index) => {
    const token = tokens[index]

    const content = resolvePDF(token.meta)
    token.content = content

    return content
  }
}
