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
