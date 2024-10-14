import type { RuleOptions } from 'markdown-it/lib/ruler.mjs'
import type { Markdown } from 'vuepress/markdown'

export interface EmbedRuleBlockOptions<Meta extends Record<string, any>> {
  /**
   * @[type]()
   */
  type: string
  /**
   * token name
   */
  name?: string
  beforeName?: string
  syntaxPattern: RegExp
  ruleOptions?: RuleOptions
  meta: (match: RegExpMatchArray) => Meta
  content: (meta: Meta) => string
}

// @[name]()
export function createEmbedRuleBlock<Meta extends Record<string, any> = Record<string, any>>(
  md: Markdown,
  {
    type,
    name = type,
    syntaxPattern,
    beforeName = 'import_code',
    ruleOptions = { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
    meta,
    content,
  }: EmbedRuleBlockOptions<Meta>,
): void {
  const MIN_LENGTH = type.length + 5
  const START_CODES = [64, 91, ...type.split('').map(c => c.charCodeAt(0))]

  md.block.ruler.before(
    beforeName,
    name,
    (state, startLine, endLine, silent) => {
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
      const match = state.src.slice(pos, max).match(syntaxPattern)
      if (!match)
        return false

      // return true as we have matched the syntax
      /* istanbul ignore if -- @preserve */
      if (silent)
        return true

      const token = state.push(name, '', 0)

      token.meta = meta(match)
      token.map = [startLine, startLine + 1]

      state.line = startLine + 1

      return true
    },
    ruleOptions,
  )

  md.renderer.rules[name] = (tokens, index) => {
    const token = tokens[index]
    token.content = content(token.meta)
    return token.content
  }
}
