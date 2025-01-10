import type Token from 'markdown-it/lib/token.mjs'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'

export interface DemoFile {
  type: 'vue' | 'normal' | 'css' | 'markdown'
  export?: string
  path: string
  gitignore?: boolean
}

export interface MarkdownDemoEnv extends MarkdownEnv {
  demoFiles?: DemoFile[]
}

export interface DemoMeta {
  type: 'vue' | 'normal' | 'markdown'
  url: string
  title?: string
  desc?: string
  codeSetting?: string
  expanded?: boolean
}

export interface DemoContainerRender {
  before: (
    app: App,
    md: Markdown,
    env: MarkdownDemoEnv,
    meta: DemoMeta,
    codeMap: Record<string, string>
  ) => string
  after: () => string
  token?: (token: Token, tokens: Token[], index: number) => void
}
