import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'
import { resolveAttrs } from '../utils/resolveAttrs.js'

/**
 * Type for getting RenderRule parameters
 *
 * 获取 RenderRule 参数的类型
 */
type RenderRuleParams = Parameters<RenderRule> extends [...infer Args, infer _] ? Args : never

/**
 * Container options
 *
 * 自定义容器的配置项
 */
export interface ContainerOptions {
  /**
   * Callback for rendering container opening tag
   *
   * 渲染容器起始标签时的回调
   */
  before?: (info: string, ...args: RenderRuleParams) => string
  /**
   * Callback for rendering container closing tag
   *
   * 渲染容器结束标签时的回调
   */
  after?: (info: string, ...args: RenderRuleParams) => string
}

/**
 * Create markdown-it custom container plugin
 *
 * 创建 markdown-it 的自定义容器插件
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 * @param type - Container type (e.g., 'tip', 'warning') / 容器类型（如 'tip', 'warning' 等）
 * @param options - Optional before/after render hooks / 可选的 before/after 渲染钩子
 * @param options.before - Callback for rendering container opening tag / 渲染容器起始标签时的回调函数
 * @param options.after - Callback for rendering container closing tag / 渲染容器结束标签时的回调函数
 */
export function createContainerPlugin(
  md: Markdown,
  type: string,
  { before, after }: ContainerOptions = {},
): void {
  // Custom render rule
  const render: RenderRule = (tokens, index, options, env): string => {
    const token = tokens[index]
    // Extract info after :::
    const info = token.info.trim().slice(type.length).trim() || ''
    if (token.nesting === 1) {
      // Container opening tag
      return before?.(info, tokens, index, options, env) ?? `<div class="custom-container ${type}">`
    }
    else {
      // Container closing tag
      return after?.(info, tokens, index, options, env) ?? '</div>'
    }
  }

  // Register markdown-it-container plugin
  md.use(container, type, { render })
}

/**
 * Create a custom container rule where content is not processed by markdown-it
 * Requires custom content processing logic
 * ```md
 * ::: type
 *  xxxx    <-- content: this part will not be processed by markdown-it
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
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 * @param type - Container type / 容器类型
 * @param render - Custom render rule / 自定义渲染规则
 */
export function createContainerSyntaxPlugin(
  md: Markdown,
  type: string,
  render?: RenderRule,
): void {
  const maker = ':'
  const markerMinLen = 3

  /**
   * Custom container block rule definition
   *
   * 自定义容器的 block 规则定义
   *
   * @param state - Current block state / 当前 block 状态
   * @param startLine - Start line / 起始行
   * @param endLine - End line / 结束行
   * @param silent - Silent mode / 是否为静默模式
   * @returns Whether matched / 是否匹配到自定义容器
   */
  function defineContainer(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]
    let pos = start

    // check marker
    // Check if starts with specified maker (:)
    if (state.src[pos] !== maker)
      return false

    // Check if marker length meets requirements
    for (pos = start + 1; pos <= max; pos++) {
      if (state.src[pos] !== maker)
        break
    }

    if (pos - start < markerMinLen)
      return false

    const markup = state.src.slice(start, pos)
    const info = state.src.slice(pos, max).trim()

    // ::: type
    // Check if info starts with type
    if (!info.startsWith(type))
      return false

    /* istanbul ignore if -- @preserve */
    if (silent)
      return true

    let line = startLine
    let content = ''
    // Collect container content until end marker
    while (++line < endLine) {
      if (state.src.slice(state.bMarks[line], state.eMarks[line]).trim() === markup) {
        break
      }

      content += `${state.src.slice(state.bMarks[line], state.eMarks[line])}\n`
    }

    // Create token, save content and attributes
    const token = state.push(`${type}_container`, '', 0)
    token.meta = resolveAttrs(info.slice(type.length)).attrs
    token.content = content
    token.markup = `${markup} ${type}`
    token.map = [startLine, line + 1]

    state.line = line + 1

    return true
  }

  // Default render function
  const defaultRender: RenderRule = (tokens, index) => {
    const { content } = tokens[index]
    return `<div class="custom-container ${type}">${content}</div>`
  }

  // Register block rule and render rule
  md.block.ruler.before('fence', `${type}_definition`, defineContainer)
  md.renderer.rules[`${type}_container`] = render ?? defaultRender
}
