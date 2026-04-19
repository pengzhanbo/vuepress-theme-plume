/**
 * Wiki Link 是属于 obsidian 官方扩展的 markdown 语法
 *
 * [[文件名]]  [[文件名#标题]]  [[文件名#标题#标题]] [[文件名#标题|别名]]
 *
 * @see - https://obsidian.md/zh/help/links
 *
 * 插件提供的是对该语法的兼容性支持，并非实现其完全的功能。
 */

import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { ensureLeadingSlash, isLinkHttp } from 'vuepress/shared'
import { path } from 'vuepress/utils'
import { resolvePaths } from '../enhance/links.js'
import { slugify } from '../utils/slugify.js'
import { findFirstPage } from './findFirstPage.js'

interface WikiLinkMeta {
  filename: string
  alias: string
  titles: string[]
}

const wikiLinkDef: RuleInline = (state, silent) => {
  let found = false
  const max = state.posMax
  const start = state.pos

  if (
    state.src.charCodeAt(start) !== 0x5B
    || state.src.charCodeAt(start + 1) !== 0x5B
  ) {
    return false
  }

  /* istanbul ignore if -- @preserve */
  if (silent)
    return false

  // - [[]]
  if (max - start < 5)
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
  const content = state.src.slice(start + 2, state.pos).trim()
  // found!
  state.posMax = state.pos
  state.pos = start + 2

  const [file, alias] = content.split('|')
  const [filename, ...titles] = file.trim().split('#')

  const token = state.push('obsidian_wiki_link', '', 0)
  token.markup = '[[]]'
  token.meta = {
    filename: filename.trim(),
    titles: titles.map(title => title.trim()),
    alias: alias?.trim(),
  } as WikiLinkMeta
  token.content = content

  state.pos = state.posMax + 2
  state.posMax = max

  return true
}

export function wikiLinkPlugin(md: Markdown) {
  md.inline.ruler.before('emphasis', 'obsidian_wiki_link', wikiLinkDef)
  md.renderer.rules.obsidian_wiki_link = (tokens, idx, _, env: MarkdownEnv) => {
    const token = tokens[idx]
    const { filename, titles, alias } = token.meta as WikiLinkMeta
    const anchor = titles.at(-1)
    const slug = anchor ? `#${slugify(anchor)}` : ''
    // external link
    if (isLinkHttp(filename)) {
      const text = alias || (filename + (titles.length ? ` > ${titles.join(' > ')}` : ''))
      return `<a href="${filename}${slug}" target="_blank" rel="noopener noreferrer">${
        md.utils.escapeHtml(text)
      }</a>`
    }
    // internal hash link
    if (!filename) { // internal page hash link
      return `<VPLink href="${slug}">${md.utils.escapeHtml(alias) || (titles.length ? `<template #after-text>${md.utils.escapeHtml(` > ${titles.join(' > ')}`)}</template>` : '')}</VPLink>`
    }
    const pagePath = findFirstPage(filename, env.filePathRelative ?? '')
    if (pagePath) {
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
      return `<VPLink href="${ensureLeadingSlash(pagePath)}${slug}">${md.utils.escapeHtml(alias) || (titles.length ? `<template #after-text>${md.utils.escapeHtml(` > ${titles.join(' > ')}`)}</template>` : '')}</VPLink>`
    }

    // other asset url
    const url = ensureLeadingSlash(filename[0] === '.' ? path.join(path.dirname(env.filePathRelative ?? ''), filename) : filename)
    const text = alias || (filename + (titles.length ? ` > ${titles.join(' > ')}` : ''))
    return `<a href="${url}${slug}" target="_blank" rel="noopener noreferrer">${
      md.utils.escapeHtml(text)
    }</a>`
  }
}
