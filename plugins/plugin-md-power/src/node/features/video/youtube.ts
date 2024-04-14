/**
 * @[youtube](id)
 */
import { URLSearchParams } from 'node:url'
import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { YoutubeTokenMeta } from '../../../shared/video.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { parseRect } from '../../utils/parseRect.js'
import { timeToSeconds } from '../../utils/timeToSeconds.js'

const YOUTUBE_LINK = 'https://www.youtube.com/embed/'

// @[youtube]()
const MIN_LENGTH = 13

// char codes of '@[youtube'
const START_CODES = [64, 91, 121, 111, 117, 116, 117, 98, 101]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[youtube(?:\s+([^]*?))?\]\(([^)]*)\)/

function createYoutubeRuleBlock(): RuleBlock {
  return (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // return false if the length is shorter than min length
    if (pos + MIN_LENGTH > max)
      return false

    // check if it's matched the start
    for (let i = 0; i < START_CODES.length; i += 1) {
      if (state.src.charCodeAt(pos + i) !== START_CODES[i])
        return false
    }

    // check if it's matched the syntax
    const match = state.src.slice(pos, max).match(SYNTAX_RE)
    if (!match)
      return false

    // return true as we have matched the syntax
    if (silent)
      return true

    const [, info = '', id = ''] = match

    const { attrs } = resolveAttrs(info)

    const meta: YoutubeTokenMeta = {
      id,
      autoplay: attrs.autoplay ?? false,
      loop: attrs.loop ?? false,
      start: timeToSeconds(attrs.start),
      end: timeToSeconds(attrs.end),
      title: attrs.title,
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '',
      ratio: attrs.ratio ? parseRect(attrs.ratio) : '',
    }

    const token = state.push('video_youtube', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = info

    state.line = startLine + 1

    return true
  }
}

function resolveYoutube(meta: YoutubeTokenMeta): string {
  const params = new URLSearchParams()

  meta.autoplay && params.set('autoplay', '1')
  meta.loop && params.set('loop', '1')
  meta.start && params.set('start', meta.start.toString())
  meta.end && params.set('end', meta.end.toString())

  const source = `${YOUTUBE_LINK}/${meta.id}?${params.toString()}`

  return `<VideoYoutube src="${source}" width="${meta.width}" height="${meta.height}" ratio="${meta.ratio}" title="${meta.title}" />`
}

export const youtubePlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'video_youtube',
    createYoutubeRuleBlock(),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.video_youtube = (tokens, index) => {
    const token = tokens[index]

    const content = resolveYoutube(token.meta)
    token.content = content

    return content
  }
}
