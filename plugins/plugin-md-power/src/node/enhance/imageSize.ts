import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type { ClientRequest } from 'node:http'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { Buffer } from 'node:buffer'
import http from 'node:https'
import { URL } from 'node:url'
import { attempt, attemptAsync, isBoolean, objectEntries, withTimeout } from '@pengzhanbo/utils'
import { isLinkHttp } from '@vuepress/helper'
import pMap from 'p-map'
import { tinyImageSize } from 'tiny-image-size'
import { fs, logger, path } from 'vuepress/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'

/**
 * Image size interface
 *
 * 图片尺寸接口
 */
interface ImgSize {
  /**
   * Image width
   *
   * 图片宽度
   */
  width: number
  /**
   * Image height
   *
   * 图片高度
   */
  height: number
}

/**
 * Regular expression for matching markdown image syntax
 *
 * 匹配 markdown 图片语法的正则表达式
 */
const REG_IMG = /!\[[^\]]*\]\([^)]*\)/g
/**
 * Regular expression for matching HTML img tag
 *
 * 匹配 HTML img 标签的正则表达式
 */
const REG_IMG_TAG = /<img([^>]*)>/g
/**
 * Regular expression for matching src/srcset attribute
 *
 * 匹配 src/srcset 属性的正则表达式
 */
const REG_IMG_TAG_SRC = /src(?:set)?=(['"])(.+?)\1/g
/**
 * List of badge URLs to exclude
 *
 * 要排除的徽章 URL 列表
 */
const BADGE_LIST = [
  'https://img.shields.io',
  'https://badge.fury.io',
  'https://badgen.net',
  'https://forthebadge.com',
  'https://vercel.com/button',
  'https://npmx.dev',
  'https://codecov.io',
]

/**
 * Maximum bytes to read from a remote image
 *
 * 远程图片读取的最大字节数，超出后中止请求以避免内存耗尽
 */
const MAX_REMOTE_IMAGE_SIZE = 10 * 1024 * 1024

/**
 * Cache of resolved image sizes to avoid repeated file/network requests
 *
 * 已解析图片尺寸的缓存，避免重复的文件读取或网络请求
 */
const imageSizeCache = new Map<string, ImgSize | null>()

/**
 * Image size plugin - Add width and height attributes to images
 *
 * 图片尺寸插件 - 为图片添加宽度和高度属性
 *
 * @param app - VuePress app / VuePress 应用
 * @param md - Markdown instance / Markdown 实例
 * @param type - Image size type: 'local', 'all', or false / 图片尺寸类型：'local'、'all' 或 false
 */
export async function imageSizePlugin(
  app: App,
  md: Markdown,
  type: boolean | 'local' | 'all' = false,
): Promise<void> {
  if (!app.env.isBuild || !type)
    return

  const start = performance.now()
  const images = await scanImage(app)
  const sizes = await getAllImageOriginalSize(images, type === 'all')

  if (app.env.isDebug) {
    logger.info(`[vuepress-plugin-md-power] imageSizePlugin: scan all images time spent: ${performance.now() - start}ms`)
  }

  const imageRule = md.renderer.rules.image!.bind(md)
  md.renderer.rules.image = (tokens, idx, options, env: MarkdownEnv, self) => {
    const token = tokens[idx]
    const width = token.attrGet('width')
    const height = token.attrGet('height')
    const src = token.attrGet('src')
    const url = resolveImagePath(app, src, env.filePath)

    if ((width && height) || !url || !sizes[url] || src?.startsWith('data:'))
      return imageRule(tokens, idx, options, env, self)

    const size = resolveSize(sizes[url], width, height)

    token.attrSet('width', `${size.width}`)
    token.attrSet('height', `${size.height}`)

    return imageRule(tokens, idx, options, env, self)
  }

  md.renderer.rules.html_block = createHtmlRule(md.renderer.rules.html_block!.bind(md))
  md.renderer.rules.html_inline = createHtmlRule(md.renderer.rules.html_inline!.bind(md))

  /**
   * Create HTML rule for processing img tags
   *
   * 创建处理 img 标签的 HTML 规则
   *
   * @param rawHtmlRule - Original HTML rule / 原始 HTML 规则
   * @returns New HTML rule / 新的 HTML 规则
   */
  function createHtmlRule(rawHtmlRule: RenderRule): RenderRule {
    return (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      token.content = token.content.replace(REG_IMG_TAG, (raw, info) => {
        const attrs = resolveAttrs(info)
        const src = attrs.src || attrs.srcset
        const url = resolveImagePath(app, src, env.filepath)
        const { width, height } = attrs

        if ((width && height) || !url || !sizes[url] || src?.startsWith('data:'))
          return raw

        const size = resolveSize(sizes[url], width, height)

        attrs.width = size.width
        attrs.height = size.height

        const imgAttrs = objectEntries(attrs)
          .map(([key, value]) => isBoolean(value) ? key : `${key}="${String(value)}"`)
          .join(' ')

        return `<img ${imgAttrs}>`
      })
      return rawHtmlRule(tokens, idx, options, env, self)
    }
  }

  /**
   * Resolve image size from source
   *
   * 从源解析图片尺寸
   *
   * @param original - Image source / 图片源
   * @param width - Existing width / 现有宽度
   * @param height - Existing height / 现有高度
   * @returns Image size / 图片尺寸
   */
  function resolveSize(
    original: ImgSize,
    width: string | null,
    height: string | null,
  ): ImgSize {
    const { width: originalWidth, height: originalHeight } = original

    const ratio = originalWidth / originalHeight

    if (width && !height) {
      const w = Number.parseInt(width, 10)
      return { width: w, height: Math.round(w / ratio) }
    }
    if (height && !width) {
      const h = Number.parseInt(height, 10)
      return { width: Math.round(h * ratio), height: h }
    }
    return { width: originalWidth, height: originalHeight }
  }
}

/**
 * Scan all images in the source directory
 *
 * 扫描源目录中的所有图片
 *
 * @param app - VuePress app / VuePress 应用
 * @returns List of image URLs / 图片 URL 列表
 */
async function scanImage(app: App): Promise<string[]> {
  if (!app.env.isBuild)
    return []

  const cwd = app.dir.source()
  const files = await fs.readdir(cwd, { recursive: true })
  const result = new Set<string>()

  await pMap(files as string[], async (file) => {
    const filepath = path.join(cwd, file)
    if (
      (await (fs.stat(filepath))).isFile()
      && filepath.endsWith('.md')
      && !filepath.includes('.vuepress')
      && !filepath.includes('node_modules')
    ) {
      const content = await fs.readFile(filepath, 'utf-8')
      // [xx](xxx)
      const syntaxMatched = content.match(REG_IMG) ?? []
      for (const img of syntaxMatched) {
        const url = resolveImagePath(app, img.slice(img.indexOf('](') + 2, -1).split(/\s+/)[0], filepath)
        url && result.add(url)
      }
      // <img src=""> or <img srcset="xxx">
      const tagMatched = content.match(REG_IMG_TAG) ?? []
      for (const img of tagMatched) {
        const url = resolveImagePath(app, img.match(REG_IMG_TAG_SRC)?.[2] ?? '', filepath)
        url && result.add(url)
      }
    }
  }, { concurrency: 64 })

  return Array.from(result)
}

/**
 * Get original size of all images
 *
 * 获取所有图片的原始尺寸
 *
 * @param images - List of image URLs / 图片 URL 列表
 * @param includeRemote - Whether to include remote images / 是否包含远程图片
 * @returns Record of image URLs and their sizes / 图片 URL 及其尺寸的记录
 */
async function getAllImageOriginalSize(
  images: string[],
  includeRemote = false,
): Promise<Record<string, ImgSize>> {
  const result: Record<string, ImgSize> = {}

  // 并发获取图片尺寸，避免大量图片时串行等待导致的构建耗时膨胀。
  await pMap(images, async (src) => {
    const size = await getImageOriginalSize(src, includeRemote)
    if (size)
      result[src] = size
  }, { concurrency: 16 })

  return result
}

export async function getImageOriginalSize(
  image: string | null | undefined,
  includeRemote = false,
): Promise<ImgSize | null> {
  if (!image)
    return null

  const cacheKey = `${includeRemote ? 'remote' : 'local'}:${image}`
  const cached = imageSizeCache.get(cacheKey)
  if (cached !== undefined)
    return cached

  const size = await resolveImageOriginalSize(image, includeRemote)
  imageSizeCache.set(cacheKey, size)

  return size
}

async function resolveImageOriginalSize(
  image: string,
  includeRemote: boolean,
): Promise<ImgSize | null> {
  const isRemote = isLinkHttp(image)
  // remote image
  if (isRemote && includeRemote && !BADGE_LIST.some(badge => image.startsWith(badge))) {
    const { width, height } = await fetchRemoteImageSize(
      image.startsWith('//') ? `https:${image}` : image,
    )
    if (width && height)
      return { width, height }
  }
  if (!isRemote) {
    const [, data] = await attemptAsync(() => fs.readFile(image))
    if (data) {
      const [, size] = attempt(() => tinyImageSize(data))
      if (size?.width && size?.height)
        return size
    }
  }
  return null
}

/**
 * Resolve image path from source
 *
 * 从源解析图片路径
 *
 * @param app - VuePress app / VuePress 应用
 * @param src - Image source / 图片源
 * @param currentPath - Current path / 当前路径
 * @returns Image path / 图片路径
 */
export function resolveImagePath(app: App, src?: string | null, currentPath?: string | null): string {
  if (!src)
    return ''
  if (isLinkHttp(src))
    return src

  if (src[0] === '/')
    return app.dir.public(src.slice(1))

  return currentPath ? path.resolve(currentPath, src) : ''
}

/**
 * Fetch image size from remote URL
 *
 * 从远程 URL 获取图片尺寸
 *
 * @param src - Image URL / 图片 URL
 * @returns Image size / 图片尺寸
 */
async function fetchRemoteImageSize(src: string): Promise<ImgSize> {
  const empty: ImgSize = { width: 0, height: 0 }

  let link: URL
  try {
    link = new URL(src)
  }
  catch {
    return empty
  }

  // 仅允许 https 协议，避免远程图片以明文传输。
  if (link.protocol !== 'https:') {
    logger.warn(`[vuepress-plugin-md-power] skip fetching remote image over a non-https protocol: ${src}`)
    return empty
  }

  let request: ClientRequest | undefined

  const promise = new Promise<ImgSize>((resolve) => {
    request = http
      .get(link, async (stream) => {
        const chunks: Buffer[] = []
        let received = 0

        try {
          for await (const chunk of stream) {
            received += chunk.length
            // 限制响应体大小，避免恶意大文件持续占用内存。
            if (received > MAX_REMOTE_IMAGE_SIZE) {
              stream.destroy()
              return resolve(empty)
            }
            chunks.push(chunk)
            const [, data] = attempt(tinyImageSize, Buffer.concat(chunks))
            if (data && data.width && data.height)
              return resolve(data)
          }
          resolve(empty)
        }
        catch {
          // 超时销毁请求会使异步迭代器拒绝，此处吞掉该取消引发的异常。
          resolve(empty)
        }
      })
      .on('error', () => resolve(empty))
  })

  try {
    return await withTimeout(() => promise, 3000)
  }
  catch {
    // 超时后销毁请求，避免连接继续运行。
    request?.destroy()
  }

  return empty
}
