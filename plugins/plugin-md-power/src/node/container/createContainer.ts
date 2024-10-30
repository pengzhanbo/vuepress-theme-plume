import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'

export interface ContainerOptions {
  before?: (info: string, tokens: Token[], idx: number) => string
  after?: (info: string, tokens: Token[], idx: number) => string
}

export function createContainerPlugin(md: Markdown, type: string, options: ContainerOptions = {}) {
  const render = (tokens: Token[], index: number): string => {
    const token = tokens[index]
    const info = token.info.trim().slice(type.length).trim() || ''
    if (token.nesting === 1) {
      return options.before?.(info, tokens, index) || `<div class="custom-container ${type}">`
    }
    else {
      return options.after?.(info, tokens, index) || '</div>'
    }
  }

  md.use(container, type, { render })
}
