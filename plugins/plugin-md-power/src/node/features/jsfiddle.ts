/**
 * @[jsfiddle](user/id)
 * @[jsfiddle theme="dark" tab="js,css,html,result"](user/id)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { parseRect } from '../utils/parseRect.js'
import type { JSFiddleTokenMeta } from '../../shared/jsfiddle.js'

const JS_FIDDLE_LINK = 'https://jsfiddle.net/'

// @[jsfiddle]()
const MIN_LENGTH = 13

// char codes of `@[jsfiddle`
const START_CODES = [64, 91, 106, 115, 102, 105, 100, 100, 108, 101]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[jsfiddle(?:\s+([^]*?))?\]\(([^)]*?)\)/

function createJsFiddleRuleBlock(): RuleBlock {
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
    const [user, id] = source.split('/')

    const meta: JSFiddleTokenMeta = {
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '400px',
      user,
      id,
      title: attrs.title || 'JS Fiddle',
      tab: attrs.tab?.replace(/\s+/g, '') || 'js,css,html,result',
      theme: attrs.theme || 'dark',
    }

    const token = state.push('js_fiddle', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = info

    state.line = startLine + 1

    return true
  }
}

function resolveJsFiddle(meta: JSFiddleTokenMeta): string {
  const { title = 'JS Fiddle', height, width, user, id, tab } = meta
  const theme = meta.theme === 'dark' ? '/dark/' : ''

  const link = `${JS_FIDDLE_LINK}${user}/${id}/embedded/${tab}${theme}`
  const style = `width:${width};height:${height};margin:16px auto;border:none;border-radius:5px;`

  return `<iframe class="js-fiddle-iframe-wrapper" style="${style}" title="${title}" src="${link}" allowfullscreen="true" allowpaymentrequest="true"></iframe>`
}

export const jsfiddlePlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'js_fiddle',
    createJsFiddleRuleBlock(),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.js_fiddle = (tokens, index) => {
    const token = tokens[index]

    const content = resolveJsFiddle(token.meta)
    token.content = content

    return content
  }
}
