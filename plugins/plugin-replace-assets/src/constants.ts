export const PLUGIN_NAME = 'vuepress-plugin-replace-assets'

export const KNOWN_IMAGE_EXTENSIONS: string[] = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'avif',
]

export const KNOWN_MEDIA_EXTENSIONS: string[] = [
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'flac',
  'aac',
  'm3u8',
  'm3u',
  'flv',

  'pdf',
]

export const KNOWN_ASSET_EXTENSIONS: string[] = [
  ...KNOWN_IMAGE_EXTENSIONS,
  ...KNOWN_MEDIA_EXTENSIONS,
]
