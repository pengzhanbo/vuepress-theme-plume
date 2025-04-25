/**
 * ::fluent-mdl2:toggle-filled::
 * ::fluent-mdl2:toggle-filled /#fff::
 * ::fluent-mdl2:toggle-filled =128px /#fff::
 *
 * @deprecated :[fluent-mdl2:toggle-filled 128px/#fff]: 此语法已废弃
 */

import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type { MarkdownEnv } from 'vuepress/markdown'
import type { IconsOptions } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'

function createIconRule(
  [l1, l2, r1, r2]: readonly [number, number, number, number],
  deprecated?: boolean,
): RuleInline {
  return (state, silent) => {
    let found = false
    const max = state.posMax
    const start = state.pos

    // ::xxx
    // ^^
    if (
      state.src.charCodeAt(start) !== l1
      || state.src.charCodeAt(start + 1) !== l2
    ) {
      return false
    }

    const next = state.src.charCodeAt(start + 2)

    // :: xxx  |  :::xxx
    //   ^     |    ^
    if (next === 0x20 || next === 0x3A)
      return false

    /* istanbul ignore if -- @preserve */
    if (silent)
      return false

    // ::::
    if (max - start < 5)
      return false

    state.pos = start + 2

    while (state.pos < max) {
    // ::xxx::
    //      ^^
      if (
        state.src.charCodeAt(state.pos) === r1
        && state.src.charCodeAt(state.pos + 1) === r2
      ) {
        found = true
        break
      }

      state.md.inline.skipToken(state)
    }

    if (
      !found
      || start + 2 === state.pos
      // ::xxx ::
      //      ^
      || state.src.charCodeAt(state.pos - 1) === 0x20
    ) {
      state.pos = start

      return false
    }

    const info = state.src.slice(start + 2, state.pos)

    // found
    state.posMax = state.pos
    state.pos = start + 2

    const icon = state.push('icon', 'i', 0)

    icon.markup = '::'
    icon.content = info
    icon.meta = { deprecated }

    state.pos = state.posMax + 2
    state.posMax = max

    return true
  }
}

const RE_SIZE = /(?<=\s|^)=(.+?)(?:\s|$)/
const RE_COLOR = /(?<=\s|^)\/(.+?)(?:\s|$)/

function iconRender(content: string, options: IconsOptions): string {
  let size = options.size
  let color = options.color

  content = content
    .replace(RE_SIZE, (_, s) => {
      size = s
      return ''
    })
    .replace(RE_COLOR, (_, c) => {
      color = c
      return ''
    })
    .trim()

  const [name, ...extra] = content.split(/\s+/)

  return `<VPIcon${stringifyAttrs({ name, size, color, class: extra.length ? extra.join(' ') : undefined })} />`
}

export const iconPlugin: PluginWithOptions<IconsOptions> = (md, options = {}) => {
  /**
   * ::collect:icon_name =size /color::
   */
  md.inline.ruler.before(
    'link',
    'icon',
    //               :     :      :      :
    createIconRule([0x3A, 0x3A, 0x3A, 0x3A]),
  )
  /**
   * :[collect:icon_name size/color]:
   * @deprecated
   */
  md.inline.ruler.before(
    'link',
    'icon_deprecated',
    //               :     [      ]      :
    createIconRule([0x3A, 0x5B, 0x5D, 0x3A], true),
  )

  md.renderer.rules.icon = (tokens, idx, _, env: MarkdownEnv) => {
    const { content, meta } = tokens[idx]
    let icon = content

    /* istanbul ignore if -- @preserve */
    if (meta.deprecated) {
      const [name, opt = ''] = content.split(' ')
      const [size, color] = opt.trim().split('/')
      icon = `${name}${size ? ` =${size}` : ''}${color ? ` /${color}` : ''}`

      console.warn(`The icon syntax of \`${colors.yellow(`:[${content}]:`)}\` is deprecated, please use \`${colors.green(`::${icon}::`)}\` instead. (${colors.gray(env.filePathRelative || env.filePath)})`)
    }

    return iconRender(icon, options)
  }
}
