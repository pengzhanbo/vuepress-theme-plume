/**
 * @[codesandbox](id)
 * @[codesandbox share](user/id)
 * @[codesanbox title="xxx" layout="Editor+Preview" height="500px" navbar=false console=false](id#filepath)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { parseRect } from '../utils/parseRect.js'
import type { CodeSandboxTokenMeta } from '../../shared/codeSandbox.js'

// @[codesandbox]()
const MIN_LENGTH = 16

// char codes of `@[codesandbox`
const START_CODES = [64, 91, 99, 111, 100, 101, 115, 97, 110, 100, 98, 111, 120]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[codesandbox(?:\s+(embed|share))?(?:\s+([^]*?))?\]\(([^)]*?)\)/

function createCodeSandboxRuleBlock(): RuleBlock {
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

    const [, type, info = '', source] = match

    const { attrs } = resolveAttrs(info)
    const [profile, filepath = ''] = source.split('#')
    const [user, id] = profile.includes('/') ? profile.split('/') : ['', profile]

    const meta: CodeSandboxTokenMeta = {
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '500px',
      user,
      id,
      title: attrs.title ?? '',
      console: attrs.console ?? false,
      navbar: attrs.navbar ?? true,
      layout: attrs.layout ?? '',
      type: (type || 'embed') as CodeSandboxTokenMeta['type'],
      filepath,
    }

    const token = state.push('code_sandbox', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = match[0]

    state.line = startLine + 1

    return true
  }
}

function resolveCodeSandbox(meta: CodeSandboxTokenMeta) {
  const { title, height, width, user, id, type, filepath, console, navbar, layout } = meta

  return `<CodeSandboxViewer title="${title}" height="${height}" width="${width}" user="${user}" id="${id}" type="${type}" filepath="${filepath}" :console=${console} :navbar=${navbar} layout="${layout}" />`
}

export const codeSandboxPlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'code_sandbox',
    createCodeSandboxRuleBlock(),
  )

  md.renderer.rules.code_sandbox = (tokens, index) => {
    const token = tokens[index]

    const content = resolveCodeSandbox(token.meta)
    token.content = content

    return content
  }
}
