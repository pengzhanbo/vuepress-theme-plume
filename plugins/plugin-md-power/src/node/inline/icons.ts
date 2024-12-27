/**
 * :[mdi:11]:
 * :[mdi:11 24px]:
 * :[mid:11 /#ccc]:
 * :[fluent-mdl2:toggle-filled 128px/#fff]:
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type { IconsOptions } from '../../shared/index.js'

export const iconsPlugin: PluginWithOptions<IconsOptions> = (md, options = {}) =>
  md.inline.ruler.before('emphasis', 'iconify', createTokenizer(options))

function createTokenizer(options: IconsOptions): RuleInline {
  return (state, silent) => {
    let found = false
    const max = state.posMax
    const start = state.pos

    // :[
    if (state.src.charCodeAt(start) !== 0x3A
      || state.src.charCodeAt(start + 1) !== 0x5B) {
      return false
    }

    // :[ xxx
    //   ^
    if (state.src.charCodeAt(start + 2) === 0x20)
      return false

    if (silent)
      return false

    // :[]:
    if (max - start < 5)
      return false

    state.pos = start + 2

    while (state.pos < max) {
      // ]:
      if (state.src.charCodeAt(state.pos) === 0x5D
        && state.src.charCodeAt(state.pos + 1) === 0x3A) {
        found = true
        break
      }

      state.md.inline.skipToken(state)
    }

    if (!found || start + 2 === state.pos
      // :[xxx ]:
      //      ^
      || state.src.charCodeAt(state.pos - 1) === 0x20
    ) {
      state.pos = start

      return false
    }
    const content = state.src.slice(start + 2, state.pos)

    // found!
    state.posMax = state.pos
    state.pos = start + 2

    const [name, opt = ''] = content.split(' ')
    const [size, color = options.color] = opt.trim().split('/')

    const icon = state.push('vp_icon_open', 'VPIcon', 1)
    icon.markup = ':['
    icon.attrs = [['name', name]]

    if (size || options.size)
      icon.attrs.push(['size', String(size || options.size)])
    if (color)
      icon.attrs.push(['color', color])

    const close = state.push('vp_icon_close', 'VPIcon', -1)
    close.markup = ']:'

    state.pos = state.posMax + 2
    state.posMax = max

    return true
  }
}
