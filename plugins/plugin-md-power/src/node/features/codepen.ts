/**
 * @[codepen](user/slash)
 * @[codepen preview](user/slash)
 * @[codepen preview editable title="" height="400px" tab="css,result" theme="dark"](user/slash)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { parseRect } from '../utils/parseRect.js'
import type { CodepenTokenMeta } from '../../shared/codepen.js'

const CODEPEN_LINK = 'https://codepen.io/'

// @[codepen]()
const MIN_LENGTH = 12

// char codes of `@[codepen`
const START_CODES = [64, 91, 99, 111, 100, 101, 112, 101, 110]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[codepen(?:\s+([^]*?))?\]\(([^)]*?)\)/

function createCodepenRuleBlock(): RuleBlock {
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
    const [user, slash] = source.split('/')

    const meta: CodepenTokenMeta = {
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '400px',
      user,
      slash,
      title: attrs.title,
      preview: attrs.preview,
      editable: attrs.editable,
      tab: attrs.tab ?? 'result',
      theme: attrs.theme,
    }

    const token = state.push('codepen', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = info

    state.line = startLine + 1

    return true
  }
}

function resolveCodepen(meta: CodepenTokenMeta): string {
  const { title = 'Codepen', height, width } = meta
  const params = new URLSearchParams()
  meta.editable && params.set('editable', 'true')
  meta.tab && params.set('default-tab', meta.tab)
  meta.theme && params.set('theme-id', meta.theme)

  const middle = meta.preview ? '/embed/preview/' : '/embed/'

  const link = `${CODEPEN_LINK}${meta.user}${middle}${meta.slash}?${params.toString()}`
  const style = `width:${width};height:${height};margin:16px auto;border-radius:5px;`

  return `<iframe class="code-pen-iframe-wrapper" src="${link}" title="${title}" style="${style}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="${CODEPEN_LINK}${meta.user}/pen/${meta.slash}">${title}</a> by ${meta.user} (<a href="${CODEPEN_LINK}${meta.user}">@${meta.user}</a>) on <a href="${CODEPEN_LINK}">CodePen</a>.</iframe>`
}

export const codepenPlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'codepen',
    createCodepenRuleBlock(),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.codepen = (tokens, index) => {
    const token = tokens[index]

    const content = resolveCodepen(token.meta)
    token.content = content

    return content
  }
}
