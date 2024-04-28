import type markdownIt from 'markdown-it'
import container from 'markdown-it-container'
import type Token from 'markdown-it/lib/token.mjs'

function createReplContainer(md: markdownIt, type: string) {
  const validate = (info: string): boolean => info.trim().startsWith(type)

  const render = (tokens: Token[], index: number): string => {
    const token = tokens[index]
    if (token.nesting === 1)
      return '<LanguageRepl>'

    else
      return '</LanguageRepl>'
  }

  md.use(container, type, { validate, render })
}

export function langReplPlugin(md: markdownIt) {
  createReplContainer(md, 'kotlin-repl')
  createReplContainer(md, 'go-repl')
  createReplContainer(md, 'rust-repl')
}
