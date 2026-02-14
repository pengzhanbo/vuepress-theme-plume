import type { SizeOptions } from './size'

/**
 * Video options
 *
 * 视频配置选项
 */
export interface VideoOptions {
  /**
   * Whether to enable Bilibili video embed
   *
   * 是否启用 Bilibili 视频嵌入
   */
  bilibili?: boolean
  /**
   * Whether to enable YouTube video embed
   *
   * 是否启用 YouTube 视频嵌入
   */
  youtube?: boolean
}

/**
 * AcFun token metadata
 *
 * AcFun 令牌元数据
 */
export interface AcFunTokenMeta extends SizeOptions {
  /**
   * Video title
   *
   * 视频标题
   */
  title?: string
  /**
   * Video ID
   *
   * 视频 ID
   */
  id: string
}

/**
 * Bilibili token metadata
 *
 * Bilibili 令牌元数据
 */
export interface BilibiliTokenMeta extends SizeOptions {
  /**
   * Video title
   *
   * 视频标题
   */
  title?: string
  /**
   * BV ID
   *
   * BV ID
   */
  bvid?: string
  /**
   * AV ID
   *
   * AV ID
   */
  aid?: string
  /**
   * CID
   *
   * CID
   */
  cid?: string
  /**
   * Whether to autoplay
   *
   * 是否自动播放
   */
  autoplay?: boolean
  /**
   * Start time
   *
   * 开始时间
   */
  time?: string | number
  /**
   * Page number
   *
   * 页码
   */
  page?: number
}

/**
 * YouTube token metadata
 *
 * YouTube 令牌元数据
 */
export interface YoutubeTokenMeta extends SizeOptions {
  /**
   * Video title
   *
   * 视频标题
   */
  title?: string
  /**
   * Video ID
   *
   * 视频 ID
   */
  id: string
  /**
   * Whether to autoplay
   *
   * 是否自动播放
   */
  autoplay?: boolean
  /**
   * Whether to loop
   *
   * 是否循环播放
   */
  loop?: boolean
  /**
   * Start time
   *
   * 开始时间
   */
  start?: string | number
  /**
   * End time
   *
   * 结束时间
   */
  end?: string | number
}

/**
 * ArtPlayer token metadata
 *
 * ArtPlayer 令牌元数据
 */
export interface ArtPlayerTokenMeta extends SizeOptions {
  /**
   * Whether muted
   *
   * 是否静音
   */
  muted?: boolean
  /**
   * Whether to autoplay
   *
   * 是否自动播放
   */
  autoplay?: boolean
  /**
   * Whether auto mini mode
   *
   * 是否自动迷你模式
   */
  autoMini?: boolean
  /**
   * Whether to loop
   *
   * 是否循环播放
   */
  loop?: boolean
  /**
   * Volume level (0-1)
   *
   * 音量级别 (0-1)
   */
  volume?: number
  /**
   * Poster image URL
   *
   * 封面图片 URL
   */
  poster?: string
  /**
   * Video URL
   *
   * 视频 URL
   */
  url: string
  /**
   * Video type
   *
   * 视频类型
   */
  type?: string
}
