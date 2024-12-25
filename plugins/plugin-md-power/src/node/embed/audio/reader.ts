import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import { resolveAttrs } from '../../utils/resolveAttrs.js'

const audioReader: RuleInline = (state, silent) => {
  const max = state.posMax
  let start = state.pos
  let href = ''

  if (state.src.slice(start, start + 13) !== '@[audioReader')
    return false

  // @[audioReader]()
  if (max - start < 17)
    return false

  const labelStart = state.pos + 13
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, true)

  // not found ']'
  if (labelEnd < 0)
    return false

  let pos = labelEnd + 1
  if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
    pos++
    const code = state.src.charCodeAt(pos)
    if (code === 0x0A /* \n */ || code === 0x20 /* space */)
      return false

    start = pos
    const res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax)
    if (res.ok) {
      href = state.md.normalizeLink(res.str)
      if (state.md.validateLink(href)) {
        pos = res.pos
      }
      else {
        href = ''
      }
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */) {
      return false
    }
  }
  else {
    return false
  }

  /* istanbul ignore else -- @preserve */
  if (!silent) {
    state.pos = labelStart
    state.posMax = labelEnd
    const info = state.src.slice(labelStart, labelEnd).trim()
    const { attrs } = resolveAttrs(info)

    const tokenOpen = state.push('audio_reader_open', 'AudioReader', 1)
    tokenOpen.info = info
    tokenOpen.attrs = [['src', href]]

    if (attrs.startTime)
      tokenOpen.attrs.push([':start-time', attrs.startTime])

    if (attrs.endTime)
      tokenOpen.attrs.push([':end-time', attrs.endTime])

    if (attrs.type)
      tokenOpen.attrs.push(['type', attrs.type])

    if (attrs.volume)
      tokenOpen.attrs.push([':volume', attrs.volume])

    if (attrs.title)
      state.push('text', '', 0).content = attrs.title

    state.push('audio_reader_close', 'AudioReader', -1)
  }

  state.pos = pos + 1
  state.posMax = max
  return true
}

export const audioReaderPlugin: PluginWithOptions<never> = md =>
  md.inline.ruler.before('link', 'audio-reader', audioReader)
