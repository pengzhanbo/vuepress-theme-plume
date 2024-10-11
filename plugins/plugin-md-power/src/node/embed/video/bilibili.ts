/**
 * @[bilibili](bid)
 * @[bilibili](aid cid)
 * @[bilibili](bid aid cid)
 * @[bilibili p1 autoplay time=1](aid cid)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { BilibiliTokenMeta } from '../../../shared/index.js'
import { URLSearchParams } from 'node:url'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { timeToSeconds } from '../../utils/timeToSeconds.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

const BILIBILI_LINK = 'https://player.bilibili.com/player.html'

export const bilibiliPlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<BilibiliTokenMeta>(md, {
    type: 'bilibili',
    name: 'video_bilibili',
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    syntaxPattern: /^@\[bilibili(?:\s+p(\d+))?([^\]]*)\]\(([^)]*)\)/,
    meta([, page, info, source]) {
      const { attrs } = resolveAttrs(info)
      const ids = source.trim().split(/\s+/)
      const bvid = ids.find(id => id.startsWith('BV'))
      const [aid, cid] = ids.filter(id => !id.startsWith('BV'))

      return {
        page: +page,
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
    },
    content(meta) {
      const params = new URLSearchParams()

      if (meta.bvid) {
        params.set('bvid', meta.bvid)
      }

      if (meta.aid) {
        params.set('aid', meta.aid)
      }

      if (meta.cid) {
        params.set('cid', meta.cid)
      }

      if (meta.page) {
        params.set('p', meta.page.toString())
      }

      if (meta.time) {
        params.set('t', meta.time.toString())
      }

      params.set('autoplay', meta.autoplay ? '1' : '0')

      const source = `${BILIBILI_LINK}?${params.toString()}`

      return `<VideoBilibili src="${source}" width="${meta.width}" height="${meta.height}" ratio="${meta.ratio}" title="${meta.title}" />`
    },
  })
}
