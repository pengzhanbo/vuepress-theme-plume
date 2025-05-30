/**
 * @[artPlayer](url)
 * @[artPlayer muted autoplay autoMini loop volume=1 poster="xxxx"](url)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { ArtPlayerTokenMeta } from '../../../shared/index.js'
import { isPackageExists } from 'local-pkg'
import { colors } from 'vuepress/utils'
import { logger } from '../../utils/logger.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { stringifyAttrs } from '../../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

const installed = {
  dashjs: isPackageExists('dashjs'),
  hlsjs: isPackageExists('hls.js'),
  mpegtsjs: isPackageExists('mpegts.js'),
}

const SUPPORTED_VIDEO_TYPES = ['mp4', 'mp3', 'webm', 'ogg', 'mpd', 'dash', 'm3u8', 'hls', 'ts', 'flv']

export const artPlayerPlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<ArtPlayerTokenMeta>(md, {
    type: 'artPlayer',
    name: 'video_artPlayer',
    syntaxPattern: /^@\[artPlayer([^\]]*)\]\(([^)]*)\)/,
    meta([, info, source]) {
      const { attrs } = resolveAttrs<ArtPlayerTokenMeta>(info)
      const url = source.trim()
      checkSupportType(attrs.type ?? url.split('.').pop())

      return {
        url,
        type: attrs.type,
        autoplay: attrs.autoplay ?? false,
        muted: attrs.muted ?? attrs.autoplay ?? false,
        autoMini: attrs.autoMini ?? false,
        loop: attrs.loop ?? false,
        volume: typeof attrs.volume !== 'undefined' ? Number(attrs.volume) : 0.75,
        poster: attrs.poster,
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : undefined,
        ratio: attrs.ratio ? parseRect(`${attrs.ratio}`) : undefined,
      }
    },
    content({ url, ...meta }) {
      meta.muted = meta.muted || meta.autoplay
      return `<ArtPlayer src="${url}" fullscreen flip playback-rate aspect-ratio setting pip${stringifyAttrs(meta)}/>`
    },
  })
}

function checkSupportType(type?: string) {
  if (!type)
    return

  /* istanbul ignore if -- @preserve */
  if (SUPPORTED_VIDEO_TYPES.includes(type)) {
    let name = ''
    switch (type.toLowerCase()) {
      case 'm3u8':
      case 'hls':
        name = !installed.hlsjs ? 'hls.js' : ''
        break

      case 'flv':
      case 'ts': {
        name = !installed.mpegtsjs ? 'mpegts.js' : ''
        break
      }
      case 'mpd':
      case 'dash':
        name = !installed.dashjs ? 'dashjs' : ''
        break
    }
    /* istanbul ignore if -- @preserve */
    if (name) {
      logger.warn('artPlayer', `${colors.cyan(name)} is not installed, please install it via npm or yarn or pnpm`)
    }
  }
  else {
    /* istanbul ignore next -- @preserve */
    logger.warn('artPlayer', `unsupported video type: ${colors.cyan(type)}`)
  }
}
