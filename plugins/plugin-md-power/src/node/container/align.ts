import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'

const alignList = ['left', 'center', 'right', 'justify']

export function alignPlugin(md: Markdown): void {
  for (const name of alignList) {
    md.use(container, name, {
      validate: (info: string) => info.trim() === name,
      render: (tokens: Token[], idx: number): string => {
        if (tokens[idx].nesting === 1) {
          return `<div style="text-align:${name}">`
        }
        else {
          return '</div>'
        }
      },
    })
  }
}
