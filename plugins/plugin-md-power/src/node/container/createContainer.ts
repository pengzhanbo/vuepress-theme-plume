import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'

type RenderRuleParams = Parameters<RenderRule> extends [...infer Args, infer _] ? Args : never

export interface ContainerOptions {
  before?: (info: string, ...args: RenderRuleParams) => string
  after?: (info: string, ...args: RenderRuleParams) => string
}

export function createContainerPlugin(
  md: Markdown,
  type: string,
  { before, after }: ContainerOptions = {},
) {
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
