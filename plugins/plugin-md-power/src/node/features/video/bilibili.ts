/**
 * @[bilibili](bid)
 * @[bilibili](aid cid)
 * @[bilibili](bid aid cid)
 * @[bilibili p1 autoplay time=1](aid cid)
 */
import { URLSearchParams } from 'node:url'
import type { PluginWithOptions } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { BilibiliTokenMeta } from '../../../shared/video.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { parseRect } from '../../utils/parseRect.js'
import { timeToSeconds } from '../../utils/timeToSeconds.js'

const BILIBILI_LINK = 'https://player.bilibili.com/player.html'

// @[bilibili]()
const MIN_LENGTH = 13

// char codes of '@[bilibili'
const START_CODES = [64, 91, 98, 105, 108, 105, 98, 105, 108, 105]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[bilibili(?:\s+p(\d+))?(?:\s+([^]*?))?\]\(([^)]*)\)/

function createBilibiliRuleBlock(): RuleBlock {
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

    const [, page, info = '', source = ''] = match

    const { attrs } = resolveAttrs(info)
    const ids = source.trim().split(/\s+/)
    const bvid = ids.find(id => id.startsWith('BV'))
    const [aid, cid] = ids.filter(id => !id.startsWith('BV'))

    const meta: BilibiliTokenMeta = {
      page: +page || 1,
      bvid,
      aid,
      cid,
      autoplay: attrs.autoplay ?? false,
      time: timeToSeconds(attrs.time),
      title: attrs.title,
      width: attrs.width ? parseRect(attrs.width) : '100%',
      height: attrs.height ? parseRect(attrs.height) : '',
      ratio: attrs.ratio ? parseRect(attrs.ratio) : '',
    }

    const token = state.push('video_bilibili', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = info

    state.line = startLine + 1

    return true
  }
}

function resolveBilibili(meta: BilibiliTokenMeta): string {
  const params = new URLSearchParams()

  meta.bvid && params.set('bvid', meta.bvid)
  meta.aid && params.set('aid', meta.aid)
  meta.cid && params.set('cid', meta.cid)
  meta.page && params.set('p', meta.page.toString())
  meta.time && params.set('t', meta.time.toString())
  params.set('autoplay', meta.autoplay ? '1' : '0')

  const source = `${BILIBILI_LINK}?${params.toString()}`

  return `<VideoBilibili src="${source}" width="${meta.width}" height="${meta.height}" ratio="${meta.ratio}" title="${meta.title}" />`
}

export const bilibiliPlugin: PluginWithOptions<never> = (md) => {
  md.block.ruler.before(
    'import_code',
    'video_bilibili',
    createBilibiliRuleBlock(),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.video_bilibili = (tokens, index) => {
    const token = tokens[index]

    const content = resolveBilibili(token.meta)
    token.content = content

    return content
  }
}
