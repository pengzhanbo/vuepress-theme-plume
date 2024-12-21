import type { SizeOptions } from './size'

export interface VideoOptions {
  bilibili?: boolean
  youtube?: boolean
}

export interface BilibiliTokenMeta extends SizeOptions {
  title?: string
  bvid?: string
  aid?: string
  cid?: string
  autoplay?: boolean
  time?: string | number
  page?: number
}

export interface YoutubeTokenMeta extends SizeOptions {
  title?: string
  id: string
  autoplay?: boolean
  loop?: boolean
  start?: string | number
  end?: string | number
}

export interface ArtPlayerTokenMeta extends SizeOptions {
  muted?: boolean
  autoplay?: boolean
  autoMini?: boolean
  loop?: boolean
  volume?: number // 0-1
  poster?: string
  url: string
  type?: string
}
