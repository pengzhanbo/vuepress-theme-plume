/**
 * obsidian callouts，其表现形式类似于 vuepress alerts
 *
 * 差异点：在语法上支持 标题 和 折叠展开
 *
 * 1. 此插件将 callouts 所有类型映射到 vuepress alerts 支持的类型中
 * 2. 忽略 折叠展开功能，在 语法解析上 不处理 折叠展开逻辑
 * 3. 支持 标题
 *
 * @see - https://obsidian.md/zh/help/callouts
 */

import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { MarkdownEnv } from 'vuepress/markdown'
import type { ObsidianCalloutOptions } from '../../shared/index.js'
import { capitalize, objectEntries, uniq } from '@pengzhanbo/utils'
import { ensureLeadingSlash } from '@vuepress/helper'
import { resolveLocalePath } from 'vuepress/shared'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'

// 将 obsidian callout 映射到 vuepress alert 的类型
const calloutsToAlerts: Record<string, string[]> = {
  note: ['quote', 'cite'],
  tip: ['hint'],
  info: ['todo'],
  success: ['check', 'done'],
  warning: ['question', 'help', 'faq'],
  caution: ['attention', 'failure', 'fail', 'missing', 'danger', 'error', 'bug'],
  important: ['example'],
  details: ['abstract', 'summary', 'tldr'],
}

const callouts = objectEntries(calloutsToAlerts).map(([k, v]) => [k, ...v]).flat()
const calloutAlias = objectEntries(calloutsToAlerts)
  .reduce((acc, [k, v]) => {
    v.forEach(alias => acc[alias] = k)
    return acc
  }, {} as Record<string, string>)

const calloutsDef: RuleBlock = (state, startLine, endLine, silent) => {
  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4)
    return false

  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]

  // check the block quote marker
  if (state.src.charCodeAt(pos) !== 62 /* > */)
    return false

  let currentPos = pos + 1

  let initial = state.sCount[startLine] + 1
  let adjustTab = false

  // skip one optional space after '>'
  if (state.src.charCodeAt(currentPos) === 32 /* space */) {
    // ' >   [!tip] '
    //     ^ -- position start of line here:
    currentPos++
    initial++
  }
  else if (state.src.charCodeAt(currentPos) === 9 /* tab */) {
    if ((state.bsCount[startLine] + initial) % 4 === 3) {
      // '  >\t  [!tip] '
      //       ^ -- position start of line here (tab has width===1)
      currentPos++
      initial++
    }
    else {
      // ' >\t  [!tip] '
      //    ^ -- position start of line here + shift bsCount slightly
      //         to make extra space appear
      adjustTab = true
    }
  }

  let offset = initial

  while (currentPos < max) {
    const ch = state.src.charCodeAt(currentPos)

    if (ch === 9 /** \t */)
      offset += 4 - ((offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4)
    else if (ch === 32 /** Space */)
      offset++
    else break

    currentPos++
  }

  // skip blockquote
  if (offset - initial >= 4)
    return false

  // the minimum length of an alert is 4 characters [!x]
  if (max - currentPos < 4)
    return false

  // check opening marker '[!'
  if (
    state.src.charCodeAt(currentPos) !== 91
    || /* [ */ state.src.charCodeAt(currentPos + 1) !== 33 /* ! */
  ) {
    return false
  }

  currentPos += 2

  let typeName = ''

  // find closing bracket ']'
  while (currentPos < max) {
    const char = state.src.charAt(currentPos)

    if (char === ']')
      break

    typeName += char
    currentPos++
  }

  if (currentPos === max)
    return false

  const type = typeName.toLowerCase()

  if (!callouts.includes(type))
    return false

  // skip spaces after ']'
  currentPos = state.skipSpaces(currentPos + 1)

  // if there are non-space characters after ']', it's not a valid alert
  // if (currentPos < max)
  //   return false
  const titleContent = state.src.slice(currentPos, max)

  const oldBMarks: number[] = []
  const oldBSCount: number[] = []
  const oldSCount: number[] = []
  const oldTShift: number[] = []
  const oldLineMax = state.lineMax
  const oldParentType = state.parentType
  const terminatorRules = [
    state.md.block.ruler.getRules('blockquote'),
    state.md.block.ruler.getRules('alert'),
  ].flat()

  // @ts-expect-error: We are creating a new type called "alert"
  state.parentType = 'alert'

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag:
  //     ```
  //     > test
  //      - - -
  //     ```
  let currentLine = startLine
  let lastLineEmpty = false
  let hasBodyContent = false

  for (; currentLine < endLine; currentLine++) {
    // check if it's outdented, i.e. it's inside list item and indented
    // less than said list item:
    //
    // ```
    // 1. anything
    //    > current blockquote
    // 2. checking this line
    // ```
    const isOutdented = state.sCount[currentLine] < state.blkIndent

    pos = state.bMarks[currentLine] + state.tShift[currentLine]
    max = state.eMarks[currentLine]

    // Case 1: line is not inside the blockquote, and this line is empty.
    if (pos >= max)
      break

    if (state.src.charCodeAt(pos++) === 62 /* > */ && !isOutdented) {
      // This line is inside the blockquote.

      let spaceAfterMarker = false
      // set offset past spaces and ">"
      initial = state.sCount[currentLine] + 1
      adjustTab = false

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 32 /* space */) {
        // ' >   test '
        //     ^ -- position start of line here:
        pos++
        initial++
        spaceAfterMarker = true
      }
      else if (state.src.charCodeAt(pos) === 9 /* \t */) {
        spaceAfterMarker = true

        if ((state.bsCount[currentLine] + initial) % 4 === 3) {
          // '  >\t  test '
          //       ^ -- position start of line here (tab has width===1)
          pos++
          initial++
        }
        else {
          // ' >\t  test '
          //    ^ -- position start of line here + shift bsCount slightly
          //         to make extra space appear
          adjustTab = true
        }
      }

      offset = initial

      if (!silent) {
        oldBMarks.push(state.bMarks[currentLine])
        state.bMarks[currentLine] = pos
      }

      while (pos < max) {
        const ch = state.src.charCodeAt(pos)

        if (ch === 9 /** \t */)
          offset += 4 - ((offset + state.bsCount[currentLine] + (adjustTab ? 1 : 0)) % 4)
        else if (ch === 32 /** Space */)
          offset++
        else break

        pos++
      }

      lastLineEmpty = pos >= max
      if (currentLine > startLine && !lastLineEmpty)
        hasBodyContent = true

      if (!silent) {
        oldBSCount.push(state.bsCount[currentLine])
        state.bsCount[currentLine] = state.sCount[currentLine] + 1 + (spaceAfterMarker ? 1 : 0)

        oldSCount.push(state.sCount[currentLine])
        state.sCount[currentLine] = offset - initial

        oldTShift.push(state.tShift[currentLine])
        state.tShift[currentLine] = pos - state.bMarks[currentLine]
      }
      continue
    }

    if (isOutdented)
      break

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty)
      break

    // Case 3: another tag found.
    let terminate = false

    const terminateRuleLength = terminatorRules.length

    for (let i = 0; i < terminateRuleLength; i++) {
      const terminatorRule = terminatorRules[i]

      if (terminatorRule(state, currentLine, endLine, true)) {
        terminate = true
        break
      }
    }

    if (terminate) {
      // Quirk to enforce "hard termination mode" for paragraphs;
      // normally if you call `tokenize(state, startLine, nextLine)`,
      // paragraphs will look below nextLine for paragraph continuation,
      // but if blockquote is terminated by another tag, they shouldn't
      state.lineMax = currentLine

      if (state.blkIndent !== 0 && !silent) {
        // state.blkIndent was non-zero, we now set it to zero,
        // so we need to re-calculate all offsets to appear as
        // if indent wasn't changed
        oldBMarks.push(state.bMarks[currentLine])
        oldBSCount.push(state.bsCount[currentLine])
        oldSCount.push(state.sCount[currentLine])
        oldTShift.push(state.tShift[currentLine])

        state.sCount[currentLine] -= state.blkIndent
      }

      break
    }

    hasBodyContent = true

    if (!silent) {
      oldBMarks.push(state.bMarks[currentLine])
      oldBSCount.push(state.bsCount[currentLine])
      oldSCount.push(state.sCount[currentLine])
      oldTShift.push(state.tShift[currentLine])

      // A negative indentation means that this is a paragraph continuation
      // we only set it if it's not the first line of the body
      if (currentLine > startLine + 1)
        state.sCount[currentLine] = -1
    }
  }

  const restoreState = (): void => {
    state.lineMax = oldLineMax

    // Restore original tShift; this might not be necessary since the parser
    // has already been here, but just to make sure we can do that.
    for (let i = 0; i < oldTShift.length; i++) {
      state.bMarks[i + startLine] = oldBMarks[i]
      state.tShift[i + startLine] = oldTShift[i]
      state.sCount[i + startLine] = oldSCount[i]
      state.bsCount[i + startLine] = oldBSCount[i]
    }
  }

  // If we didn't find any alert body, so we don't have a valid alert
  if (startLine + 1 >= currentLine || !hasBodyContent) {
    state.parentType = oldParentType

    // If we are in silent mode, we don't need to restore the state
    if (!silent)
      restoreState()

    return false
  }

  // from now we know that it's going to be a valid alert,
  // so no point trying to find the end of it in silent mode
  if (silent)
    return true

  const oldIndent = state.blkIndent

  state.blkIndent = 0

  const titleLines: [number, number] = [startLine, startLine + 1]
  const contentLines: [number, number] = [startLine + 1, 0]

  const openToken = state.push('alert_open', 'div', 1)

  openToken.markup = type
  openToken.attrJoin('class', `markdown-alert markdown-alert-${type}`)
  openToken.map = contentLines

  const titleToken = state.push('alert_title', '', 0)

  titleToken.attrJoin('class', `markdown-alert-title`)
  titleToken.markup = type
  titleToken.content = typeName
  titleToken.map = titleLines
  titleToken.meta = { type, typeName, content: titleContent }

  state.md.block.tokenize(state, startLine + 1, currentLine)

  const closeToken = state.push('alert_close', 'div', -1)

  closeToken.markup = type
  contentLines[1] = state.line

  state.blkIndent = oldIndent
  state.parentType = oldParentType
  restoreState()

  return true
}

export const calloutPlugin: PluginWithOptions<ObsidianCalloutOptions> = (
  md,
  {
    openRender,
    closeRender,
    titleRender,
    locales = {},
  } = {},
) => {
  md.block.ruler.before(
    'blockquote',
    'alert',
    calloutsDef,
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.alert_open = openRender
    ?? ((tokens, index) => {
      const type = tokens[index].markup
      const actualType = calloutAlias[type] || type
      const tag = actualType === 'details' ? 'details' : 'div'
      return `<${tag} class="hint-container ${uniq([actualType, type]).join(' ')}">\n`
    })

  md.renderer.rules.alert_close = closeRender ?? ((tokens, index) => {
    const type = tokens[index].markup
    const actualType = calloutAlias[type] || type
    return `</${actualType === 'details' ? 'details' : 'div'}>\n`
  })

  md.renderer.rules.alert_title = titleRender
    ?? ((tokens, index, _, env: MarkdownEnv): string => {
      const { type, content } = tokens[index].meta
      const actualType = calloutAlias[type] || type
      const tag = actualType === 'details' ? 'summary' : 'p'
      const title = content.replace(/^\s*[+-]?/, '').trim()
      const rendered = title ? md.renderInline(title, cleanMarkdownEnv(env)) : ''
      const relativePath = ensureLeadingSlash(env.filePathRelative ?? '')
      const locale = resolveLocalePath(locales, relativePath)
      return `<${tag}${tag === 'summary' ? '' : ' class="hint-container-title"'}>${
        rendered || locales[locale]?.[type] || capitalize(type)
      }</${tag}>\n`
    })
}
