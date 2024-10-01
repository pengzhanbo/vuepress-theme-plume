import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { Buffer } from 'node:buffer'
import http from 'node:https'
import { URL } from 'node:url'
import { isLinkExternal, isLinkHttp } from '@vuepress/helper'
import imageSize from 'image-size'
import { fs, logger, path } from 'vuepress/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'

interface ImgSize {
  width: number
  height: number
}

const REG_IMG = /!\[.*?\]\(.*?\)/g
const REG_IMG_TAG = /<img(.*?)>/g
const REG_IMG_TAG_SRC = /src(?:set)?=(['"])(.+?)\1/g
const BADGE_LIST = [
  'https://img.shields.io',
  'https://badge.fury.io',
  'https://badgen.net',
  'https://forthebadge.com',
  'https://vercel.com/button',
]

const cache = new Map<string, ImgSize>()

export async function imageSizePlugin(
  app: App,
  md: Markdown,
  type: boolean | 'local' | 'all' = false,
) {
  if (!app.env.isBuild || !type)
    return

  if (type === 'all') {
    const start = performance.now()
    try {
      await scanRemoteImageSize(app)
    }
    catch {}
    if (app.env.isDebug) {
      logger.info(`[vuepress-plugin-md-power] imageSizePlugin: scan all images time spent: ${performance.now() - start}ms`)
    }
  }

  const imageRule = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env: MarkdownEnv, self) => {
    if (!env.filePathRelative || !env.filePath)
      return imageRule(tokens, idx, options, env, self)

    const token = tokens[idx]
    const src = token.attrGet('src')
    const width = token.attrGet('width')
    const height = token.attrGet('height')
    const size = resolveSize(src, width, height, env)

    if (size) {
      token.attrSet('width', `${size.width}`)
      token.attrSet('height', `${size.height}`)
    }

    return imageRule(tokens, idx, options, env, self)
  }

  const rawHtmlBlockRule = md.renderer.rules.html_block!
  const rawHtmlInlineRule = md.renderer.rules.html_inline!
  md.renderer.rules.html_block = createHtmlRule(rawHtmlBlockRule)
  md.renderer.rules.html_inline = createHtmlRule(rawHtmlInlineRule)

  function createHtmlRule(rawHtmlRule: RenderRule): RenderRule {
    return (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      token.content = token.content.replace(REG_IMG_TAG, (raw, info) => {
        const { attrs } = resolveAttrs(info)
        const src = attrs.src || attrs.srcset
        const size = resolveSize(src, attrs.width, attrs.height, env)

        if (!size)
          return raw

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

  function resolveSize(
    src: string | null | undefined,
    width: string | null | undefined,
    height: string | null | undefined,
    env: MarkdownEnv,
  ): false | ImgSize {
    if (!src || src.startsWith('data:'))
      return false

    if (width && height)
      return false

    const isExternal = isLinkExternal(src, env.base)
    const filepath = isExternal ? src : resolveImageUrl(src, env, app)

    if (isExternal) {
      if (!cache.has(filepath))
        return false
    }
    else {
      if (!cache.has(filepath)) {
        if (!fs.existsSync(filepath))
          return false

        const { width: w, height: h } = imageSize(filepath)
        if (!w || !h)
          return false

        cache.set(filepath, { width: w, height: h })
      }
    }

    const { width: originalWidth, height: originalHeight } = cache.get(filepath)!

    const ratio = originalWidth / originalHeight

    if (width && !height) {
      const w = Number.parseInt(width, 10)
      return { width: w, height: Math.round(w / ratio) }
    }
    else if (height && !width) {
      const h = Number.parseInt(height, 10)
      return { width: Math.round(h * ratio), height: h }
    }
    else {
      return { width: originalWidth, height: originalHeight }
    }
  }
}

function resolveImageUrl(src: string, env: MarkdownEnv, app: App): string {
  if (src[0] === '/')
    return app.dir.public(src.slice(1))

  if (env.filePathRelative && src[0] === '.')
    return app.dir.source(path.join(path.dirname(env.filePathRelative), src))

  // fallback
  if (env.filePath && (src[0] === '.' || src[0] === '/'))
    return path.resolve(env.filePath, src)

  return path.resolve(src)
}

export async function scanRemoteImageSize(app: App) {
  if (!app.env.isBuild)
    return
  const cwd = app.dir.source()
  const files = await fs.readdir(cwd, { recursive: true })
  const imgList: string[] = []
  for (const file of files) {
    const filepath = path.join(cwd, file)
    if (
      (await (fs.stat(filepath))).isFile()
      && !filepath.includes('.vuepress')
      && !filepath.includes('node_modules')
      && filepath.endsWith('.md')
    ) {
      const content = await fs.readFile(filepath, 'utf-8')
      // [xx](xxx)
      const syntaxMatched = content.match(REG_IMG) ?? []
      for (const img of syntaxMatched) {
        const src = img.slice(img.indexOf('](') + 2, -1)
        addList(src.split(/\s+/)[0])
      }
      // <img src=""> or <img srcset="xxx">
      const tagMatched = content.match(REG_IMG_TAG) ?? []
      for (const img of tagMatched) {
        const src = img.match(REG_IMG_TAG_SRC)?.[2] ?? ''
        addList(src)
      }
    }
  }

  function addList(src: string) {
    if (src && isLinkHttp(src)
      && !imgList.includes(src)
      && !BADGE_LIST.some(badge => src.startsWith(badge))
    ) {
      imgList.push(src)
    }
  }

  await Promise.all(imgList.map(async (src) => {
    if (!cache.has(src)) {
      const { width, height } = await fetchImageSize(src)
      if (width && height)
        cache.set(src, { width, height })
    }
  }))
}

function fetchImageSize(src: string): Promise<ImgSize> {
  const link = new URL(src)

  return new Promise((resolve) => {
    http.get(link, async (stream) => {
      const chunks: any[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
        try {
          const { width, height } = imageSize(Buffer.concat(chunks))
          if (width && height) {
            return resolve({ width, height })
          }
        }
        catch {}
      }
      const { width, height } = imageSize(Buffer.concat(chunks))
      resolve({ width: width!, height: height! })
    }).on('error', () => resolve({ width: 0, height: 0 }))
  })
}

export async function resolveImageSize(app: App, url: string, remote = false): Promise<ImgSize> {
  if (cache.has(url))
    return cache.get(url)!

  if (isLinkHttp(url) && remote) {
    return await fetchImageSize(url)
  }

  if (url[0] === '/') {
    const filepath = app.dir.public(url.slice(1))
    if (fs.existsSync(filepath)) {
      const { width, height } = imageSize(filepath)
      return { width: width!, height: height! }
    }
  }

  return { width: 0, height: 0 }
}
