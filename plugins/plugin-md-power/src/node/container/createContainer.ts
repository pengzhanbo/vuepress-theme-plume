import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'
import { resolveAttrs } from '../utils/resolveAttrs.js'

type RenderRuleParams = Parameters<RenderRule> extends [...infer Args, infer _] ? Args : never

export interface ContainerOptions {
  before?: (info: string, ...args: RenderRuleParams) => string
  after?: (info: string, ...args: RenderRuleParams) => string
}

export function createContainerPlugin(
  md: Markdown,
  type: string,
  { before, after }: ContainerOptions = {},
): void {
  const render: RenderRule = (tokens, index, options, env): string => {
    const token = tokens[index]
    const info = token.info.trim().slice(type.length).trim() || ''
    if (token.nesting === 1) {
      return before?.(info, tokens, index, options, env) ?? `<div class="custom-container ${type}">`
    }
    else {
      return after?.(info, tokens, index, options, env) ?? '</div>'
    }
  }

  md.use(container, type, { render })
}

/**
 * 创建一个自定义的容器规则，内容不会交给 markdown-it 处理。
 * 需要自定义 content 的处理逻辑
 * ```md
 * ::: type
 *  xxxx    <-- content: 这部分的内容不会交给 markdown-it 处理
 * :::
 * ```
 *
 * @example
 * ```ts
 * const example = createContainerSyntaxPlugin(md, 'example', (tokens, index, options, env) => {
 *   const { content, meta } = tokens[index]
 *   return `<div class="example">${meta.title} | ${content}</div>`
 * })
 * ```
 */
export function createContainerSyntaxPlugin(
  md: Markdown,
  type: string,
  render?: RenderRule,
): void {
  const maker = ':'
  const markerMinLen = 3

  function defineContainer(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]
    let pos = start

    // check marker
    if (state.src[pos] !== maker)
      return false

    pos += markerMinLen

    for (pos = start + 1; pos <= max; pos++) {
      if (state.src[pos] !== maker)
        break
    }

    if (pos - start < markerMinLen)
      return false

    const markup = state.src.slice(start, pos)
    const info = state.src.slice(pos, max).trim()

    // ::: type
    if (!info.startsWith(type))
      return false

    /* istanbul ignore if -- @preserve */
    if (silent)
      return true

    let line = startLine
    let content = ''
    while (++line < endLine) {
      if (state.src.slice(state.bMarks[line], state.eMarks[line]).trim() === markup) {
        break
      }

      content += `${state.src.slice(state.bMarks[line], state.eMarks[line])}\n`
    }

    const token = state.push(`${type}_container`, '', 0)
    token.meta = resolveAttrs(info.slice(type.length)).attrs
    token.content = content
    token.markup = `${markup} ${type}`
    token.map = [startLine, line + 1]

    state.line = line + 1

    return true
  }

  const defaultRender: RenderRule = (tokens, index) => {
    const { content } = tokens[index]
    return `<div class="custom-container ${type}">${content}</div>`
  }

  md.block.ruler.before('fence', `${type}_definition`, defineContainer)
  md.renderer.rules[`${type}_container`] = render ?? defaultRender
}
