/**
 * Embed Link 是属于 obsidian 官方扩展的 markdown 语法
 *
 * - ![[文件名]]  ![[文件名#标题]]  ![[文件名#标题#标题]]
 * - ![[资源链接]]：
 *   - ![[图片]]   ![[图片|width]] ![[图片|widthxheight]]
 *   - ![[pdf]] ![[pdf#page=1#height=300]]
 *   - ![[音频]]
 *   - ![[视频]]
 *
 * @see - https://obsidian.md/zh/help/embeds
 * @see - https://obsidian.md/zh/help/file-formats
 *
 * 插件提供的是对该语法的兼容性支持，并非实现其完全的功能。
 */

import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { attempt } from '@pengzhanbo/utils'
import grayMatter from 'gray-matter'
import Token from 'markdown-it/lib/token.mjs'
import { ensureLeadingSlash, isLinkHttp } from 'vuepress/shared'
import { fs, hash, path } from 'vuepress/utils'
import { checkSupportType, SUPPORTED_VIDEO_TYPES } from '../embed/video/artPlayer.js'
import { resolvePaths } from '../enhance/links.js'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { parseRect } from '../utils/parseRect.js'
import { slugify } from '../utils/slugify.js'
import { findFirstPage } from './findFirstPage.js'

interface EmbedLinkMeta {
  filename: string
  hashes: string[]
  settings: string
  isInline: boolean
}

const EXTENSION_IMAGES: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.avif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.apng', '.jfif', '.pjpeg', '.pjp', '.xbm']
const EXTENSION_AUDIOS: string[] = ['.mp3', '.flac', '.wav', '.ogg', '.opus', '.webm', '.acc']
const EXTENSION_VIDEOS: string[] = SUPPORTED_VIDEO_TYPES.map(ext => `.${ext}`)

const blockEmbedLinkDef: RuleBlock = (state, startLine, endLine, silent) => {
  const start = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]

  // - ![[]]
  if (max - start < 6)
    return false

  // 是否以 `![[` 开头
  if (
    state.src.charCodeAt(start) !== 0x21 // \!
    || state.src.charCodeAt(start + 1) !== 0x5B // [
    || state.src.charCodeAt(start + 2) !== 0x5B // [
  ) {
    return false
  }

  const line = state.src.slice(start, max).trim()
  // 是否以 `]]` 结尾
  if (
    line.charCodeAt(line.length - 1) !== 0x5D // ]
    || line.charCodeAt(line.length - 2) !== 0x5D // ]
  ) {
    return false
  }

  /* istanbul ignore if -- @preserve */
  if (silent)
    return true

  // ![[xxxx]]
  //    ^^^^  <- content
  const content = line.slice(3, -2).trim()
  genEmbedAsset(state, content)

  state.line = startLine + 1
  return true
}

const inlineEmbedLinkDef: RuleInline = (state, silent) => {
  let found = false
  const max = state.posMax
  const start = state.pos

  if (
    state.src.charCodeAt(start) !== 0x21 // \!
    || state.src.charCodeAt(start + 1) !== 0x5B // [
    || state.src.charCodeAt(start + 2) !== 0x5B // [
  ) {
    return false
  }

  /* istanbul ignore if -- @preserve */
  if (silent)
    return false

  // - ![[]]
  if (max - start < 6)
    return false

  state.pos = start + 2

  // 查找 ]]
  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x5D
      && state.src.charCodeAt(state.pos + 1) === 0x5D) {
      found = true
      break
    }

    state.md.inline.skipToken(state)
  }

  if (!found || start + 2 === state.pos) {
    state.pos = start
    return false
  }
  // [[xxxx]]
  //   ^^^^  <- content
  const content = state.src.slice(start + 3, state.pos).trim()
  // found!
  state.posMax = state.pos
  state.pos = start + 3

  genEmbedAsset(state, content, true)

  state.pos = state.posMax + 2
  state.posMax = max

  return true
}

export function embedLinkPlugin(md: Markdown, app: App): void {
  md.block.ruler.before(
    'import_code',
    'obsidian_block_embed_link',
    blockEmbedLinkDef,
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
  )
  md.inline.ruler.before('emphasis', 'obsidian_inline_embed_link', inlineEmbedLinkDef)

  md.renderer.rules.obsidian_embed_link = (tokens, idx, _, env: MarkdownEnv) => {
    const token = tokens[idx]
    const { filename, hashes, settings, isInline } = token.meta as EmbedLinkMeta
    const pagePath = findFirstPage(filename, env.filePathRelative ?? '')
    // 行内规则，解析为链接
    if (isInline && pagePath) {
      const anchor = hashes.at(-1)
      const slug = anchor ? `#${slugify(anchor)}` : ''
      const { absolutePath, relativePath } = resolvePaths(
        pagePath,
        env.base || '/',
        env.filePathRelative ?? null,
      )
      ;(env.links ??= []).push({
        raw: pagePath,
        absolute: absolutePath,
        relative: relativePath,
      })
      return `<VPLink href="${ensureLeadingSlash(pagePath)}${slug}">${md.utils.escapeHtml(settings) || (hashes.length ? `<template #after-text>${md.utils.escapeHtml(` > ${hashes.join(' > ')}`)}</template>` : '')}</VPLink>`
    }

    // 解析为内部 markdown 资源，提取 markdown 片段并插入到当前页面
    if (pagePath) {
      const [error, markdown] = attempt(() => fs.readFileSync(app.dir.source(pagePath), 'utf-8'))
      if (error) {
        console.warn(`[embedLinkPlugin] can not read file: ${pagePath}`)
        return ''
      }
      const { content: rawContent } = grayMatter(markdown)
      if (!rawContent) {
        console.warn(`[embedLinkPlugin] file ${pagePath} is empty`)
        return ''
      }
      const content = extractContentByHeadings(rawContent, hashes)
      pagePath && (env.importedFiles ??= []).push(pagePath)
      return md.render(content, cleanMarkdownEnv(env))
    }

    // 其他资源，解析为链接
    const url = ensureLeadingSlash(filename[0] === '.' ? path.join(path.dirname(env.filePathRelative ?? ''), filename) : filename)
    const anchor = hashes.at(-1)
    const slug = anchor ? `#${slugify(anchor)}` : ''
    const text = settings || (filename + (hashes.length ? ` > ${hashes.join(' > ')}` : ''))
    return `<a href="${url}${slug}" target="_blank" rel="noopener noreferrer">${
      md.utils.escapeHtml(text)
    }</a>`
  }
}

function genEmbedAsset(state: StateBlock | StateInline, content: string, isInline = false): void {
  const [file, settings] = content.split('|').map(x => x.trim())
  const [filename, ...hashes] = file.trim().split('#').map(x => x.trim())
  const extname = path.extname(filename).toLowerCase()

  // 渲染为 图片
  if (EXTENSION_IMAGES.includes(extname)) {
    const token = state.push('image', 'img', 1)
    token.content = filename
    token.attrSet('src', resolveFilenameToAssetPath(filename))
    token.attrSet('alt', filename)
    if (settings) {
      const [width, height] = settings.split('x').map(x => x.trim())
      const styles: string[] = []
      if (width)
        styles.push(`width: ${parseRect(width)}`)
      if (height)
        styles.push(`height: ${parseRect(height)}`)
      token.attrSet('style', styles.join(';'))
    }
    const text = new Token('text', '', 0)
    text.content = filename
    token.children = [text]
  }
  // 渲染为音频
  else if (EXTENSION_AUDIOS.includes(extname)) {
    const token = state.push('audio_open', 'audio', 1)
    token.content = filename
    token.attrSet('controls', 'true')
    token.attrSet('preload', 'metadata')
    token.attrSet('aria-label', filename)
    const sourceToken = state.push('source_open', 'source', 1)
    sourceToken.attrSet('src', resolveFilenameToAssetPath(filename))
    state.push('audio_close', 'audio', -1)
  }
  // 渲染为视频，使用 ArtPlayer
  else if (EXTENSION_VIDEOS.includes(extname)) {
    const token = state.push('video_artPlayer_open', 'ArtPlayer', 1)
    const type = extname.slice(1)
    checkSupportType(type)
    token.attrSet('src', resolveFilenameToAssetPath(filename))
    token.attrSet('type', type)
    token.attrSet('width', '100%')
    token.attrSet(':fullscreen', 'true')
    token.attrSet(':flip', 'true')
    token.attrSet(':playback-rate', 'true')
    token.attrSet(':aspect-ratio', 'true')
    token.attrSet(':setting', 'true')
    token.attrSet(':pip', 'true')
    token.attrSet(':volume', '0.75')
    token.content = filename
    state.push('video_artPlayer_close', 'ArtPlayer', -1)
  }
  // 渲染为 pdf
  else if (extname === '.pdf') {
    const token = state.push('pdf_open', 'PDFViewer', 1)
    token.attrSet('src', resolveFilenameToAssetPath(filename))
    token.attrSet('width', '100%')
    for (const hash of hashes) {
      const [key, value] = hash.split('=').map(x => x.trim())
      token.attrSet(key, value)
    }
    token.content = filename
    state.push('pdf_close', 'PDFViewer', -1)
  }
  // 非受支持的外部资源，渲染为链接
  else if (isLinkHttp(filename) || (extname && extname !== '.md')) {
    const token = state.push('link_open', 'a', 1)
    token.attrSet('href', filename)
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
    token.content = filename
    const content = state.push('text', '', 0)
    content.content = filename
    state.push('link_close', 'a', -1)
  }
  // 剩余情况，如内部的 markdown 文件
  // 在 obsidian_embed_link renderer rule 中处理
  else {
    const token = state.push('obsidian_embed_link', '', 0)
    token.markup = '![[]]'
    token.meta = {
      filename: filename.trim(),
      hashes: hashes.map(hash => hash.trim()),
      settings: settings?.trim(),
      isInline,
    } as EmbedLinkMeta
    token.content = content
  }
}

function resolveFilenameToAssetPath(filename: string): string {
  if (isLinkHttp(filename) || filename[0] === '.' || filename[0] === '/') {
    return filename
  }
  return `/${filename}`
}

interface ParsedHeading {
  lineIndex: number
  level: number
  text: string
}

// 支持: ## 标题 {#id .class key=value} 或 ## 标题 {#id}
const HEADING_HASH_REG = /^#+/
const HEADING_ATTRS_REG = /(?:\{[^}]*\})?$/

function extractContentByHeadings(content: string, headings: string[]): string {
  if (!headings.length)
    return content

  const containers: Record<string, string> = {}

  content = content.replaceAll(/(?<mark>:{3,})[\s\S]*?\k<mark>/g, (matched) => {
    const key = hash(matched)
    containers[key] = matched
    return `<!--container:${key}-->`
  })
  const lines = content.split(/\r?\n/)

  const allHeadings: ParsedHeading[] = []

  for (let i = 0; i < lines.length; i++) {
    let text = lines[i].trimEnd()
    let level = 0
    text = text.replace(HEADING_HASH_REG, (matched) => {
      level = matched.length
      return ''
    })
    if (level) {
      text = text.replace(HEADING_ATTRS_REG, '').trim()
      allHeadings.push({ lineIndex: i, level, text })
    }
  }

  // 查找匹配的标题序列（逻辑同上）
  let targetHeadingIndex = -1
  let currentLevel = 0
  let headingPointer = 0

  for (let i = 0; i < allHeadings.length; i++) {
    const heading = allHeadings[i]

    if (headingPointer === 0) {
      if (heading.text === headings[0]) {
        headingPointer++
        currentLevel = heading.level
        if (headingPointer === headings.length) {
          targetHeadingIndex = i
          break
        }
      }
    }
    else {
      if (heading.level > currentLevel && heading.text === headings[headingPointer]) {
        headingPointer++
        currentLevel = heading.level
        if (headingPointer === headings.length) {
          targetHeadingIndex = i
          break
        }
      }
      else if (heading.level <= currentLevel) {
        if (heading.text === headings[0]) {
          headingPointer = 1
          currentLevel = heading.level
        }
        else {
          headingPointer = 0
          currentLevel = 0
        }
      }
    }
  }

  if (targetHeadingIndex === -1) {
    console.warn(`No heading found for ${headings.join(' > ')}`)
    return ''
  }

  const targetHeading = allHeadings[targetHeadingIndex]
  const startLine = targetHeading.lineIndex + 1
  const targetLevel = targetHeading.level

  let endLine = lines.length
  for (let i = targetHeadingIndex + 1; i < allHeadings.length; i++) {
    if (allHeadings[i].level <= targetLevel) {
      endLine = allHeadings[i].lineIndex
      break
    }
  }

  const result = lines.slice(startLine, endLine).join('\n').trim()

  return result.replaceAll(/<!--container:(.*?)-->/g, (_, key) => containers[key] ?? '')
}
