/**
 * Forked and modified from https://github.com/markdown-it/markdown-it-abbr/blob/master/index.mjs
 */

import type { PluginSimple } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { RuleCore } from 'markdown-it/lib/parser_core.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'

interface AbbrStateBlock extends StateBlock {
  env: {
    abbreviations?: Record<string, string>
  }
}

interface AbbrStateCore extends StateCore {
  env: {
    abbreviations?: Record<string, string>
  }
}

export const abbrPlugin: PluginSimple = (md) => {
  const { arrayReplaceAt, escapeRE, lib } = md.utils

  // ASCII characters in Cc, Sc, Sm, Sk categories we should terminate on;
  // you can check character classes here:
  // http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
  const OTHER_CHARS = ' \r\n$+<=>^`|~'
  const UNICODE_PUNCTUATION_REGEXP = (lib.ucmicro.P as RegExp).source
  const UNICODE_SPACE_REGEXP = (lib.ucmicro.Z as RegExp).source
  const WORDING_REGEXP_TEXT = `${UNICODE_PUNCTUATION_REGEXP}|${UNICODE_SPACE_REGEXP}|[${OTHER_CHARS.split('').map(escapeRE).join('')}]`

  const abbrDefinition: RuleBlock = (
    state: AbbrStateBlock,
    startLine,
    _endLine,
    silent,
  ) => {
    let labelEnd = -1
    let pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    if (
      pos + 2 >= max
      || state.src.charAt(pos++) !== '*'
      || state.src.charAt(pos++) !== '['
    ) {
      return false
    }

    const labelStart = pos

    while (pos < max) {
      const ch = state.src.charAt(pos)

      if (ch === '[')
        return false
      if (ch === ']') {
        labelEnd = pos
        break
      }
      if (ch === '\\')
        pos++
      pos++
    }

    if (labelEnd < 0 || state.src.charAt(labelEnd + 1) !== ':')
      return false
    if (silent)
      return true

    const label = state.src.slice(labelStart, labelEnd).replace(/\\(.)/g, '$1')
    const title = state.src.slice(labelEnd + 2, max).trim()

    if (!label.length || !title.length)
      return false;

    // prepend ':' to avoid conflict with Object.prototype members
    (state.env.abbreviations ??= {})[`:${label}`] ??= title

    state.line = startLine + 1

    return true
  }

  const abbrReplace: RuleCore = (state: AbbrStateCore) => {
    const tokens = state.tokens
    const { abbreviations } = state.env

    if (!abbreviations)
      return

    const abbreviationsRegExpText = Object.keys(abbreviations)
      .map(x => x.substring(1))
      .sort((a, b) => b.length - a.length)
      .map(escapeRE)
      .join('|')

    const regexpSimple = new RegExp(`(?:${abbreviationsRegExpText})`)

    const regExp = new RegExp(
      `(^|${WORDING_REGEXP_TEXT})(${abbreviationsRegExpText})($|${WORDING_REGEXP_TEXT})`,
      'g',
    )

    for (const token of tokens) {
      if (token.type !== 'inline')
        continue

      let children = token.children!

      // We scan from the end, to keep position when new tags added.
      for (let index = children.length - 1; index >= 0; index--) {
        const currentToken = children[index]

        if (currentToken.type !== 'text')
          continue

        const text = currentToken.content

        regExp.lastIndex = 0

        // fast regexp run to determine whether there are any abbreviated words
        // in the current token
        if (!regexpSimple.test(text))
          continue

        const nodes: Token[] = []
        let match: RegExpExecArray | null
        let pos = 0

        // eslint-disable-next-line no-cond-assign
        while ((match = regExp.exec(text))) {
          const [, before, word, after] = match

          if (match.index > 0 || before.length > 0) {
            const token = new state.Token('text', '', 0)

            token.content = text.slice(pos, match.index + before.length)
            nodes.push(token)
          }

          const abbrToken = new state.Token('abbreviation', 'Abbreviation', 0)
          abbrToken.content = word
          abbrToken.info = abbreviations[`:${word}`]

          nodes.push(abbrToken)

          regExp.lastIndex -= after.length
          pos = regExp.lastIndex
        }

        if (!nodes.length)
          continue

        if (pos < text.length) {
          const token = new state.Token('text', '', 0)

          token.content = text.slice(pos)
          nodes.push(token)
        }

        // replace current node
        token.children = children = arrayReplaceAt(children, index, nodes)
      }
    }
  }

  md.block.ruler.before('reference', 'abbr_definition', abbrDefinition, {
    alt: ['paragraph', 'reference'],
  })

  md.core.ruler.after('linkify', 'abbr_replace', abbrReplace)

  md.renderer.rules.abbreviation = (tokens, idx, _, env) => {
    const { content, info } = tokens[idx]
    const rendered = md.renderInline(info, cleanMarkdownEnv(env))
    const label = rendered.replace(/<[^>]*>/g, '')
    return `<Abbreviation aria-label="${label}">${content}${info ? `<template #tooltip>${rendered}</template>` : ''}</Abbreviation>`
  }
}
