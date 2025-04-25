import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { stringifyAttrs } from '../../utils/stringifyAttrs.js'

interface AudioReaderTokenMeta {
  src?: string
  startTime?: number
  endTime?: number
  type?: string
  volume?: number
  title?: string
}

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
    const { attrs } = resolveAttrs<AudioReaderTokenMeta>(info)

    const token = state.push('audio_reader', 'AudioReader', 0)
    token.info = info
    token.meta = { src: href, ...attrs } as AudioReaderTokenMeta
  }

  state.pos = pos + 1
  state.posMax = max
  return true
}

export const audioReaderPlugin: PluginWithOptions<never> = (md) => {
  md.renderer.rules.audio_reader = (tokens, idx) => {
    const meta = (tokens[idx].meta ?? {}) as AudioReaderTokenMeta
    if (meta.startTime)
      meta.startTime = Number(meta.startTime)

    if (meta.endTime)
      meta.endTime = Number(meta.endTime)

    if (meta.volume)
      meta.volume = Number(meta.volume)

    return `<AudioReader${stringifyAttrs(meta)} />`
  }

  md.inline.ruler.before('link', 'audio-reader', audioReader)
}
