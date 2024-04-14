/**
 * @[replit](user/repl-name)
 * @[replit](user/repl-name#filepath)
 * @[replit title="" height="400px" width="100%" theme="dark"](user/repl-name)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { parseRect } from '../utils/parseRect.js'
import type { ReplitTokenMeta } from '../../shared/replit.js'

// @[replit]()
const MIN_LENGTH = 11

// char codes of `@[replit`
const START_CODES = [64, 91, 114, 101, 112, 108, 105, 116]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[replit(?:\s+([^]*?))?\]\(([^)]*?)\)/

function createReplitRuleBlock(): RuleBlock {
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

    const [, info = '', source] = match

    const { attrs } = resolveAttrs(info)

    const meta: ReplitTokenMeta = {
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '450px',
      source: source.startsWith('@') ? source : `@${source}`,
      title: attrs.title,
      theme: attrs.theme || '',
    }

    const token = state.push('replit', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = info

    state.line = startLine + 1

    return true
  }
}

function resolveReplit(meta: ReplitTokenMeta): string {
  const { title, height, width, source, theme } = meta

  return `<ReplitViewer title="${title || ''}" height="${height}" width="${width}" source="${source}" theme="${theme}" />`
}

export const replitPlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'replit',
    createReplitRuleBlock(),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.replit = (tokens, index) => {
    const token = tokens[index]

    const content = resolveReplit(token.meta)
    token.content = content

    return content
  }
}
