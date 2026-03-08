import type { LocaleConfig } from 'vuepress'
import type { EncryptSnippetLocale } from '../shared/encrypt.js'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'

declare const __MD_POWER_INJECT_OPTIONS__: MarkdownPowerPluginOptions
declare const __MD_POWER_DASHJS_INSTALLED__: boolean
declare const __MD_POWER_HLSJS_INSTALLED__: boolean
declare const __MD_POWER_MPEGTSJS_INSTALLED__: boolean
declare const __MD_POWER_ENCRYPT_LOCALES__: LocaleConfig<EncryptSnippetLocale>

/**
 * Plugin options injected at build time.
 *
 * 构建时注入的插件选项。
 */
export const pluginOptions: MarkdownPowerPluginOptions = __MD_POWER_INJECT_OPTIONS__

/**
 * Package installation status for video streaming libraries.
 *
 * 视频流媒体库的安装状态。
 */
export const installed: {
  dashjs: boolean
  hlsjs: boolean
  mpegtsjs: boolean
} = {
  dashjs: __MD_POWER_DASHJS_INSTALLED__,
  hlsjs: __MD_POWER_HLSJS_INSTALLED__,
  mpegtsjs: __MD_POWER_MPEGTSJS_INSTALLED__,
}

/**
 * Supported video types for ArtPlayer.
 *
 * ArtPlayer 支持的视频类型。
 */
export const ART_PLAYER_SUPPORTED_VIDEO_TYPES: string[] = ['mp4', 'mp3', 'webm', 'ogg']

if (installed.dashjs) {
  ART_PLAYER_SUPPORTED_VIDEO_TYPES.push('mpd', 'dash')
}

if (installed.hlsjs) {
  ART_PLAYER_SUPPORTED_VIDEO_TYPES.push('m3u8', 'hls')
}

if (installed.mpegtsjs) {
  ART_PLAYER_SUPPORTED_VIDEO_TYPES.push('ts', 'flv')
}

/**
 * Injection key for timeline component communication.
 *
 * 时间线组件通信的注入键。
 */
export const INJECT_TIMELINE_KEY: symbol = Symbol(
  __VUEPRESS_DEV__ ? 'timeline' : '',
)

/**
 * Injection key for collapse component communication.
 *
 * 折叠面板组件通信的注入键。
 */
export const INJECT_COLLAPSE_KEY: symbol = Symbol(
  __VUEPRESS_DEV__ ? 'collapse' : '',
)

/**
 * Encrypt snippet locale data.
 *
 * 加密片段本地化数据。
 */
export const ENCRYPT_LOCALES = __MD_POWER_ENCRYPT_LOCALES__
