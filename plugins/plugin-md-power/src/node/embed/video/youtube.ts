/**
 * @[youtube](id)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { YoutubeTokenMeta } from '../../../shared/index.js'
import { URLSearchParams } from 'node:url'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { timeToSeconds } from '../../utils/timeToSeconds.js'
import { createEmbedRuleBlock } from '..//createEmbedRuleBlock.js'

const YOUTUBE_LINK = 'https://www.youtube.com/embed/'

export const youtubePlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<YoutubeTokenMeta>(md, {
    type: 'youtube',
    name: 'video_youtube',
    syntaxPattern: /^@\[youtube([^\]]*)\]\(([^)]*)\)/,
    meta([, info, id]) {
      const { attrs } = resolveAttrs(info)

      return {
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
    },
    content(meta) {
      const params = new URLSearchParams()

      if (meta.autoplay) {
        params.set('autoplay', '1')
      }

      if (meta.loop) {
        params.set('loop', '1')
      }

      if (meta.start) {
        params.set('start', meta.start.toString())
      }

      if (meta.end) {
        params.set('end', meta.end.toString())
      }

      const source = `${YOUTUBE_LINK}/${meta.id}?${params.toString()}`

      return `<VideoYoutube src="${source}" width="${meta.width}" height="${meta.height}" ratio="${meta.ratio}" title="${meta.title}" />`
    },
  })
}
