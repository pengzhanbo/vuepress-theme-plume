import type { MarkdownPowerPluginOptions } from '../shared/index.js'

declare const __MD_POWER_INJECT_OPTIONS__: MarkdownPowerPluginOptions
declare const __MD_POWER_DASHJS_INSTALLED__: boolean
declare const __MD_POWER_HLSJS_INSTALLED__: boolean
declare const __MD_POWER_MPEGTSJS_INSTALLED__: boolean

export const pluginOptions = __MD_POWER_INJECT_OPTIONS__

export const installed = {
  dashjs: __MD_POWER_DASHJS_INSTALLED__,
  hlsjs: __MD_POWER_HLSJS_INSTALLED__,
  mpegtsjs: __MD_POWER_MPEGTSJS_INSTALLED__,
}

export const ART_PLAYER_SUPPORTED_VIDEO_TYPES = ['mp4', 'mp3', 'webm', 'ogg']

if (installed.dashjs) {
  ART_PLAYER_SUPPORTED_VIDEO_TYPES.push('mpd', 'dash')
}

if (installed.hlsjs) {
  ART_PLAYER_SUPPORTED_VIDEO_TYPES.push('m3u8', 'hls')
}

if (installed.mpegtsjs) {
  ART_PLAYER_SUPPORTED_VIDEO_TYPES.push('ts', 'flv')
}
