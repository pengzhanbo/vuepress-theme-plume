/**
 * Forked and modified from https://github.com/markdown-it/markdown-it-abbr/blob/master/index.mjs
 *
 * 从 https://github.com/markdown-it/markdown-it-abbr/blob/master/index.mjs 分叉并修改
 */

import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { RuleCore } from 'markdown-it/lib/parser_core.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import { isEmptyObject, objectMap } from '@pengzhanbo/utils'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'

/**
 * Abbreviation state block
 *
 * 缩写词状态块
 */
interface AbbrStateBlock extends StateBlock {
  /**
   * Environment
   *
   * 环境
   */
  env: {
    /**
     * Abbreviations record
     *
     * 缩写词记录
     */
    abbreviations?: Record<string, string>
  }
}

/**
 * Abbreviation state core
 *
 * 缩写词核心状态
 */
interface AbbrStateCore extends StateCore {
  /**
   * Environment
   *
   * 环境
   */
  env: {
    /**
     * Abbreviations record
     *
     * 缩写词记录
     */
    abbreviations?: Record<string, string>
  }
}

/**
 * Abbreviation plugin - Enable abbreviation syntax
 *
 * 缩写词插件 - 启用缩写词语法
 *
 * Definition syntax: *[ABBREV]: Full description
 * 定义语法：*[缩写]: 完整描述
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 * @param globalAbbreviations - Global abbreviations preset / 全局缩写词预设
 */
export const abbrPlugin: PluginWithOptions<Record<string, string>> = (md, globalAbbreviations = {}) => {
  const { arrayReplaceAt, escapeRE, lib } = md.utils
  globalAbbreviations = objectMap(
    globalAbbreviations,
    (key, value) => [key.startsWith(':') ? key : `:${key}`, value],
  )
  // ASCII characters in Cc, Sc, Sm, Sk categories we should terminate on;
  // you can check character classes here:
  // http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
  const OTHER_CHARS = ' \r\n$+<=>^`|~'
  const UNICODE_PUNCTUATION_REGEXP = (lib.ucmicro.P as RegExp).source
  const UNICODE_SPACE_REGEXP = (lib.ucmicro.Z as RegExp).source
  const WORDING_REGEXP_TEXT = `${UNICODE_PUNCTUATION_REGEXP}|${UNICODE_SPACE_REGEXP}|[${OTHER_CHARS.split('').map(escapeRE).join('')}]`

  /**
   * Abbreviation definition rule
   *
   * 缩写词定义规则
   *
   * @param state - State block / 状态块
   * @param startLine - Start line number / 开始行号
   * @param _endLine - End line number / 结束行号
   * @param silent - Silent mode / 静默模式
   * @returns Whether matched / 是否匹配
   */
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
    /* istanbul ignore if -- @preserve */
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

  /**
   * Abbreviation replace rule
   *
   * 缩写词替换规则
   *
   * @param state - State core / 核心状态
   */
  const abbrReplace: RuleCore = (state: AbbrStateCore) => {
    const tokens = state.tokens
    const { abbreviations: localAbbreviations } = state.env

    if (!localAbbreviations && isEmptyObject(globalAbbreviations))
      return

    const abbreviations = { ...globalAbbreviations, ...localAbbreviations }
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

        /* istanbul ignore if -- @preserve */
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
