/**
 * Forked and modified from https://github.com/markdown-it/markdown-it-abbr/blob/master/index.mjs
 *
 * 从 https://github.com/markdown-it/markdown-it-abbr/blob/master/index.mjs 分叉并修改
 */

import type { Env, StateBlock, StateCore, Token } from 'markdown-it'
import type { Markdown } from 'vuepress/markdown'
import type { BlockRule, CoreRule } from '../types/index.js'
import { isEmptyObject, objectKeys, objectMap } from '@pengzhanbo/utils'
import { cleanHtmlAllTag } from '../utils/cleanHtml.js'
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
  } & Env
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
  } & Env
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
export function abbrPlugin(md: Markdown, globalAbbreviations: Record<string, string> = {}) {
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

  // Abbreviation labels are injected into the rendered Vue template. Labels containing
  // whitespace, angle brackets or curly braces could therefore inject HTML tags or
  // `{{ expression }}` template interpolations, so only safe labels are matched.
  // 缩写词标签会被注入到渲染后的 Vue 模板中。含空白、尖括号或花括号的标签可能注入 HTML 标签或
  // `{{ 表达式 }}` 模板插值，因此仅匹配安全的标签。
  const SAFE_ABBR_LABEL = /^[^\s<>{}]+$/

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
  const abbrDefinition: BlockRule = (state: AbbrStateBlock, startLine, _endLine, silent) => {
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
  const abbrReplace: CoreRule = (state: AbbrStateCore) => {
    const tokens = state.tokens
    const { abbreviations: localAbbreviations } = state.env

    if (!localAbbreviations && isEmptyObject(globalAbbreviations))
      return

    const abbreviations = { ...globalAbbreviations, ...localAbbreviations }
    const abbreviationsRegExpText = objectKeys(abbreviations)
      .map(x => `${x}`.substring(1))
      .filter(label => SAFE_ABBR_LABEL.test(label))
      .sort((a, b) => b.length - a.length)
      .map(escapeRE)
      .join('|')

    if (!abbreviationsRegExpText)
      return

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

          const abbrToken = new state.Token('abbreviation', 'VPAbbreviation', 0)
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

  md.renderer.rules.abbreviation = (tokens, idx, _, env = {}) => {
    const { content, info } = tokens[idx]
    const rendered = md.renderInline(info, cleanMarkdownEnv(env))
    const label = cleanHtmlAllTag(rendered)
    // `content` comes from the matched source text and is rendered into the Vue template,
    // so it must be escaped to avoid injecting tags or template expressions.
    // `content` 来自匹配到的原文且会被渲染进 Vue 模板，必须转义，避免注入标签或模板表达式。
    return `<VPAbbreviation aria-label="${md.utils.escapeHtml(label)}">${md.utils.escapeHtml(content)}${info ? `<template #tooltip>${rendered}</template>` : ''}</VPAbbreviation>`
  }
}
