import type { PluginSimple } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs'
import type Token from 'markdown-it/lib/token.mjs'

interface AnnotationToken extends Token {
  meta: {
    label: string
  }
}

interface AnnotationEnv extends Record<string, unknown> {
  annotations: Record<string, {
    sources: string[]
    rendered: string[]
  }>
}

interface AnnotationStateBlock extends StateBlock {
  tokens: AnnotationToken[]
  env: AnnotationEnv
}

interface AnnotationStateInline extends StateInline {
  tokens: AnnotationToken[]
  env: AnnotationEnv
}

const annotationDef: RuleBlock = (
  state: AnnotationStateBlock,
  startLine: number,
  endLine: number,
  silent: boolean,
) => {
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

const annotationRef: RuleInline = (
  state: AnnotationStateInline,
  silent: boolean,
): boolean => {
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

  if (!silent) {
    const refToken = state.push('annotation_ref', '', 0)

    refToken.meta = { label } as AnnotationToken['meta']
  }

  state.pos = pos
  state.posMax = max

  return true
}

export const annotationPlugin: PluginSimple = (md) => {
  md.renderer.rules.annotation_ref = (
    tokens: AnnotationToken[],
    idx: number,
    _,
    env: AnnotationEnv,
  ) => {
    const label = tokens[idx].meta.label
    const data = env.annotations[`:${label}`]

    return `<Annotation label="${label}" :total="${data.sources.length}">${
      data.sources.map((source, i) => {
        const annotation = data.rendered[i] ??= md.render(source, env)
        return `<template #item-${i}>${annotation}</template>`
      }).join('')
    }</Annotation>`
  }

  md.inline.ruler.before('image', 'annotation_ref', annotationRef)

  md.block.ruler.before('reference', 'annotation', annotationDef, {
    alt: ['paragraph', 'reference'],
  })
}
