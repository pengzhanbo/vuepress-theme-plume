import type { Env, MarkdownItOptions, RendererRule, StateBlock, StateInline, Token } from 'markdown-it'
import type { Markdown } from 'vuepress/markdown'
import { objectMap, toArray } from '@pengzhanbo/utils'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv'

/**
 * Annotation token with meta information
 *
 * 带元信息的注释令牌
 */
interface AnnotationToken extends Token {
  /**
   * Token meta information
   *
   * 令牌元信息
   */
  meta: {
    /**
     * Annotation label
     *
     * 注释标签
     */
    label: string
  } & Record<string, unknown>
}

/**
 * Annotation environment
 *
 * 注释环境
 */
interface AnnotationEnv extends Env {
  /**
   * Annotations record
   *
   * 注释记录
   */
  annotations: Record<string, {
    /**
     * Source texts
     *
     * 源文本
     */
    sources: string[]
    /**
     * Rendered contents
     *
     * 渲染后的内容
     */
    rendered: string[]
  }>
}

/**
 * Annotation state block
 *
 * 注释状态块
 */
interface AnnotationStateBlock extends StateBlock {
  /**
   * Tokens array
   *
   * 令牌数组
   */
  tokens: AnnotationToken[]
  /**
   * Environment
   *
   * 环境
   */
  env: AnnotationEnv
}

/**
 * Annotation state inline
 *
 * 注释行内状态
 */
interface AnnotationStateInline extends StateInline {
  /**
   * Tokens array
   *
   * 令牌数组
   */
  tokens: AnnotationToken[]
  /**
   * Environment
   *
   * 环境
   */
  env: AnnotationEnv
}

/**
 * Annotation definition rule
 *
 * 注释定义规则
 *
 * @param _state - State block / 状态块
 * @param startLine - Start line number / 开始行号
 * @param endLine - End line number / 结束行号
 * @param silent - Silent mode / 静默模式
 * @returns Whether matched / 是否匹配
 */
function annotationDef(_state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
  const state = _state as AnnotationStateBlock
  const start = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]

  if (
    // line should be at least 5 chars - "[+x]:"
    start + 4 > max
    || state.src.charAt(start) !== '['
    || state.src.charAt(start + 1) !== '+'
  ) {
    return false
  }

  let pos = start + 2

  while (pos < max) {
    if (state.src.charAt(pos) === ' ')
      return false
    if (state.src.charAt(pos) === ']')
      break
    pos++
  }

  if (
    // empty annotation label
    pos === start + 2
    || pos + 1 >= max
    || state.src.charAt(++pos) !== ':'
  ) {
    return false
  }
  /* istanbul ignore if -- @preserve */
  if (silent)
    return true

  pos++

  const data = state.env.annotations ??= {}
  const label = state.src.slice(start + 2, pos - 2)

  let annotation = state.src.slice(pos, max).trim()

  // 处理多行注释
  let nextLine = startLine + 1
  while (nextLine < endLine) {
    const nextStart = state.bMarks[nextLine] + state.tShift[nextLine]
    const nextMax = state.eMarks[nextLine]
    const source = state.src.slice(nextStart, nextMax).trim()

    // 行不为空，且行缩进小于块缩进，则跳出
    if (state.sCount[nextLine] < state.blkIndent + 2 && source !== '')
      break

    annotation += `\n${source}`
    nextLine++
  }

  const current = data[`:${label}`] ??= { sources: [], rendered: [] }
  current.sources.push(annotation)

  state.line = nextLine

  return true
}

/**
 * Annotation reference rule
 *
 * 注释引用规则
 *
 * @param _state - State inline / 行内状态
 * @param silent - Silent mode / 静默模式
 * @returns Whether matched / 是否匹配
 */
function annotationRef(_state: StateInline, silent: boolean): boolean {
  const state = _state as AnnotationStateInline
  const start = state.pos
  const max = state.posMax

  if (
    // should be at least 4 chars - "[+x]"
    start + 3 > max
    || typeof state.env.annotations === 'undefined'
    || state.src.charAt(start) !== '['
    || state.src.charAt(start + 1) !== '+'
  ) {
    return false
  }

  let pos = start + 2

  while (pos < max) {
    if (state.src.charAt(pos) === ' ' || state.src.charAt(pos) === '\n')
      return false
    if (state.src.charAt(pos) === ']')
      break
    pos++
  }

  if (
    //  empty annotation labels
    pos === start + 2
    || pos >= max
  ) {
    return false
  }

  pos++

  const label = state.src.slice(start + 2, pos - 1)
  const annotations = state.env.annotations?.[`:${label}`]?.sources ?? []

  if (annotations.length === 0)
    return false

  /* istanbul ignore if -- @preserve */
  if (!silent) {
    const refToken = state.push('annotation_ref', '', 0)

    refToken.meta = { label } as AnnotationToken['meta']
  }

  state.pos = pos
  state.posMax = max

  return true
}

/**
 * Annotation plugin - Enable annotation syntax
 *
 * 注释插件 - 启用注释语法
 *
 * Definition syntax: [+label]: annotation content
 * Reference syntax: [+label]
 *
 * 定义语法：[+label]: 注释内容
 * 引用语法：[+label]
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 * @param globalAnnotations - Global annotations preset / 全局注释预设
 */
export function annotationPlugin(md: Markdown, globalAnnotations: Record<string, string | string[]> = {}) {
  const annotations = objectMap(globalAnnotations, (key, value) => {
    return [
      key.startsWith(':') ? key : `:${key}`,
      { sources: toArray(value), rendered: [] },
    ]
  })

  md.renderer.rules.annotation_ref = ((
    tokens: AnnotationToken[],
    idx: number,
    _: MarkdownItOptions,
    env: AnnotationEnv,
  ): string => {
    const label = tokens[idx].meta.label
    /* istanbul ignore next -- @preserve */
    const data = env.annotations[`:${label}`] || annotations[`:${label}`]

    return `<VPAnnotation label="${md.utils.escapeHtml(label)}" :total="${data.sources.length}">${
      data.sources.map((source, i) => {
        const annotation = data.rendered[i] ??= md.render(source, cleanMarkdownEnv(env, ['references']))
        return `<template #item-${i}>${annotation}</template>`
      }).join('')
    }</VPAnnotation>`
  }) as unknown as RendererRule

  md.inline.ruler.before('image', 'annotation_ref', annotationRef)

  md.block.ruler.before('reference', 'annotation', annotationDef, {
    alt: ['paragraph', 'reference'],
  })
}
