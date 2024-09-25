/**
 * :[mdi:11]:
 * :[mdi:11 24px]:
 * :[mid:11 /#ccc]:
 * :[fluent-mdl2:toggle-filled 128px/#fff]:
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type { IconsOptions } from '../../shared/index.js'

const [openTag, endTag] = [':[', ']:']

export const iconsPlugin: PluginWithOptions<IconsOptions> = (md, options = {}) =>
  md.inline.ruler.before('emphasis', 'iconify', createTokenizer(options))

function createTokenizer(options: IconsOptions): RuleInline {
  return (state, silent) => {
    let found = false
    const max = state.posMax
    const start = state.pos

    if (state.src.slice(start, start + 2) !== openTag)
      return false

    if (silent)
      return false

    // :[]:
    if (max - start < 5)
      return false

    state.pos = start + 2

    while (state.pos < max) {
      if (state.src.slice(state.pos, state.pos + 2) === endTag) {
        found = true
        break
      }

      state.md.inline.skipToken(state)
    }

    if (!found || start + 2 === state.pos) {
      state.pos = start

      return false
    }
    const content = state.src.slice(start + 2, state.pos)

    // 不允许前后带有空格
    if (/^\s|\s$/.test(content)) {
      state.pos = start
      return false
    }

    // found!
    state.posMax = state.pos
    state.pos = start + 2

    const [name, opt = ''] = content.split(/\s+/)
    const [size = options.size, color = options.color] = opt.split('/')

    const icon = state.push('vp_iconify_open', 'VPIcon', 1)
    icon.markup = openTag

    if (name)
      icon.attrSet('name', name)
    if (size)
      icon.attrSet('size', String(size))
    if (color)
      icon.attrSet('color', color)

    const close = state.push('vp_iconify_close', 'VPIcon', -1)
    close.markup = endTag

    state.pos = state.posMax + 2
    state.posMax = max

    return true
  }
}
