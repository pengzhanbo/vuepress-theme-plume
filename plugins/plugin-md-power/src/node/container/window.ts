import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { isNumber, isString } from '@pengzhanbo/utils'
import { colors } from 'vuepress/utils'
import { logger } from '../utils/logger.js'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { type ContainerOptions, createContainerPlugin } from './createContainer.js'

interface WindowAttrs {
  title?: string
  height?: string
  gap?: string
  /** @deprecated */
  noPadding?: boolean
}

const RE_IMAGE_SYNTAX = /^!?\[[^\]]*\]\([^)]+\)$/

const render: NonNullable<ContainerOptions['before']> = (info, tokens, idx) => {
  const elms: Token[] = []
  for (let i = idx + 1; i < tokens.length; i++) {
    if (tokens[i].type === 'container_window_close')
      break
    elms.push(tokens[i])
  }
  const { attrs } = resolveAttrs<WindowAttrs>(info)
  let onlyImg = false
  if (elms.length === 1) {
    const { type } = elms[0]
    const content = elms[0].content.trim()
    if (type === 'html_block'
      && (content.startsWith('<img') || content.startsWith('<picture'))) {
      onlyImg = true
    }
  }
  if (elms.length === 3) {
    const [op, img, cp] = elms
    if (op.type === 'paragraph_open'
      && cp.type === 'paragraph_close'
      && img.type === 'inline'
      && RE_IMAGE_SYNTAX.test(img.content.trim())) {
      op.type = 'text'
      cp.type = 'text'
      onlyImg = true
    }
  }

  const { title, height, noPadding } = attrs
  const gap = isString(attrs.gap) || isNumber(attrs.gap)
    ? parseRect(attrs.gap)
    : (onlyImg || noPadding) ? '0' : '20px'

  const classes: string[] = ['window-wrapper']
  title && classes.push('has-title')

  return `<article class="${classes.join(' ')}">
  <header class="window-header">
    <div class="window-left"><i></i><i></i><i></i></div>
    ${title ? `<div class="window-center"><h4 class="window-title ignore-header"><span>${title}</span><i class="vpi-window-reload"></i></h4></div>` : ''}
    <div class="window-right"><i class="vpi-window-share"></i><i class="vpi-window-add"></i><i class="vpi-window-copy"></i></div>
  </header>
  <section class="window-content" style="--window-gap:${gap};${height ? `--window-height:${parseRect(height)}` : ''}">`
}

/**
 * window plugin - Enable window container
 *
 * 窗口插件 - 启用窗口容器
 *
 * Syntax: :::window title="xxx" height="100px" gap="20px"
 * 语法：:::window title="xxx" height="100px" gap="20px"
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function windowPlugin(md: Markdown): void {
  const after = () => '</section></article>'

  createContainerPlugin(md, 'window', {
    before: render,
    after,
  })
  // legacy demo-wrapper container, keep for compatibility
  createContainerPlugin(md, 'demo-wrapper', {
    before: (info, tokens, idx, _, env: MarkdownEnv) => {
      logger.warn('container', `::: demo-wrapper container is deprecated, please use ::: window container instead. (${colors.gray(env.filePathRelative || '')})`)
      return render(info, tokens, idx, _, env)
    },
    after,
  })
}
