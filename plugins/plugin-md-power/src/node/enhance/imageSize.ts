import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { Buffer } from 'node:buffer'
import http from 'node:https'
import { URL } from 'node:url'
import { attempt, withTimeout } from '@pengzhanbo/utils'
import { isLinkHttp } from '@vuepress/helper'
import imageSize from 'image-size'
import pMap from 'p-map'
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
]

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
        const { attrs } = resolveAttrs(info)
        const src = attrs.src || attrs.srcset
        const url = resolveImagePath(app, src, env.filepath)
        const { width, height } = attrs

        if ((width && height) || !url || !sizes[url] || src?.startsWith('data:'))
          return raw

        const size = resolveSize(sizes[url], width, height)

        attrs.width = size.width
        attrs.height = size.height

        const imgAttrs = Object.entries(attrs)
          .map(([key, value]) => typeof value === 'boolean' ? key : `${key}="${value}"`)
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

  for (const src of images) {
    const size = await getImageOriginalSize(src, includeRemote)
    if (size)
      result[src] = size
  }

  return result
}

export async function getImageOriginalSize(
  image: string | null | undefined,
  includeRemote = false,
): Promise<ImgSize | null> {
  if (!image)
    return null

  const isRemote = isLinkHttp(image)
  // remote image
  if (isRemote && includeRemote && !BADGE_LIST.some(badge => image.startsWith(badge))) {
    const { width, height } = await fetchRemoteImageSize(image.startsWith('//') ? `https:${image}` : image)
    if (width && height)
      return { width, height }
  }
  if (!isRemote) {
    const [, data] = attempt(() => imageSize(fs.readFileSync(image)))
    if (data?.width && data?.height)
      return { width: data.width, height: data.height }
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
function fetchRemoteImageSize(src: string): Promise<ImgSize> {
  const link = new URL(src)

  const promise = new Promise<ImgSize>((resolve) => {
    http
      .get(link, async (stream) => {
        const chunks: any[] = []
        for await (const chunk of stream) {
          chunks.push(chunk)
          const [, data] = attempt(imageSize, Buffer.concat(chunks))
          if (data && data.width && data.height)
            return resolve(data)
        }
        resolve({ width: 0, height: 0 })
      })
      .on('error', () => resolve({ width: 0, height: 0 }))
  })

  try {
    return withTimeout(() => promise, 3000)
  }
  catch {
    return Promise.resolve({ width: 0, height: 0 })
  }
}
