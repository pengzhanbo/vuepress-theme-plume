/**
 * :[mdi:11]:
 * :[mdi:11 24px]:
 * :[mid:11 /#ccc]:
 * :[fluent-mdl2:toggle-filled 128px/#fff]:
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.js'
import { parseRect } from '../../utils/parseRect.js'

type AddIcon = (iconName: string) => string | undefined

function createTokenizer(addIcon: AddIcon): RuleInline {
  return (state, silent) => {
    let found = false
    const max = state.posMax
    const start = state.pos

    if (state.src.slice(start, start + 2) !== ':[')
      return false

    if (silent)
      return false

    // :[]:
    if (max - start < 5)
      return false

    state.pos = start + 2

    while (state.pos < max) {
      if (state.src.slice(state.pos, state.pos + 2) === ']:') {
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

    const [iconName, options = ''] = content.split(/\s+/)
    const [size, color] = options.split('/')

    const open = state.push('iconify_open', 'span', 1)
    open.markup = ':['

    const className = addIcon(iconName)

    if (className)
      open.attrSet('class', className)

    let style = ''
    if (size)
      style += `width:${parseRect(size)};height:${parseRect(size)};`

    if (color)
      style += `color:${color};`

    if (style)
      open.attrSet('style', style)

    const text = state.push('text', '', 0)
    text.content = className ? '' : iconName

    const close = state.push('iconify_close', 'span', -1)
    close.markup = ']:'

    state.pos = state.posMax + 2
    state.posMax = max

    return true
  }
}

export const iconsPlugin: PluginWithOptions<AddIcon> = (
  md,
  addIcon = () => '',
) => {
  md.inline.ruler.before('emphasis', 'iconify', createTokenizer(addIcon))
}
