import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'
import { resolveAttrs } from '../utils/resolveAttrs.js'

/**
 * RenderRuleParams 类型用于获取 RenderRule 的参数类型。
 */
type RenderRuleParams = Parameters<RenderRule> extends [...infer Args, infer _] ? Args : never

/**
 * 自定义容器的配置项。
 * - before: 渲染容器起始标签时的回调
 * - after: 渲染容器结束标签时的回调
 */
export interface ContainerOptions {
  before?: (info: string, ...args: RenderRuleParams) => string
  after?: (info: string, ...args: RenderRuleParams) => string
}

/**
 * 创建 markdown-it 的自定义容器插件。
 *
 * @param md markdown-it 实例
 * @param type 容器类型（如 'tip', 'warning' 等）
 * @param options 可选的 before/after 渲染钩子
 * @param options.before 渲染容器起始标签时的回调函数
 * @param options.after 渲染容器结束标签时的回调函数
 */
export function createContainerPlugin(
  md: Markdown,
  type: string,
  { before, after }: ContainerOptions = {},
): void {
  // 自定义渲染规则
  const render: RenderRule = (tokens, index, options, env): string => {
    const token = tokens[index]
    // 提取 ::: 后的 info 信息
    const info = token.info.trim().slice(type.length).trim() || ''
    if (token.nesting === 1) {
      // 容器起始标签
      return before?.(info, tokens, index, options, env) ?? `<div class="custom-container ${type}">`
    }
    else {
      // 容器结束标签
      return after?.(info, tokens, index, options, env) ?? '</div>'
    }
  }

  // 注册 markdown-it-container 插件
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

  /**
   * 自定义容器的 block 规则定义。
   * @param state 当前 block 状态
   * @param startLine 起始行
   * @param endLine 结束行
   * @param silent 是否为静默模式
   * @returns 是否匹配到自定义容器
   */
  function defineContainer(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]
    let pos = start

    // check marker
    // 检查是否以指定的 maker（:）开头
    if (state.src[pos] !== maker)
      return false

    // 检查 marker 长度是否满足要求
    for (pos = start + 1; pos <= max; pos++) {
      if (state.src[pos] !== maker)
        break
    }

    if (pos - start < markerMinLen)
      return false

    const markup = state.src.slice(start, pos)
    const info = state.src.slice(pos, max).trim()

    // ::: type
    // 检查 info 是否以 type 开头
    if (!info.startsWith(type))
      return false

    /* istanbul ignore if -- @preserve */
    if (silent)
      return true

    let line = startLine
    let content = ''
    // 收集容器内容，直到遇到结束的 marker
    while (++line < endLine) {
      if (state.src.slice(state.bMarks[line], state.eMarks[line]).trim() === markup) {
        break
      }

      content += `${state.src.slice(state.bMarks[line], state.eMarks[line])}\n`
    }

    // 创建 token，保存内容和属性
    const token = state.push(`${type}_container`, '', 0)
    token.meta = resolveAttrs(info.slice(type.length)).attrs
    token.content = content
    token.markup = `${markup} ${type}`
    token.map = [startLine, line + 1]

    state.line = line + 1

    return true
  }

  // 默认渲染函数
  const defaultRender: RenderRule = (tokens, index) => {
    const { content } = tokens[index]
    return `<div class="custom-container ${type}">${content}</div>`
  }

  // 注册 block 规则和渲染规则
  md.block.ruler.before('fence', `${type}_definition`, defineContainer)
  md.renderer.rules[`${type}_container`] = render ?? defaultRender
}
