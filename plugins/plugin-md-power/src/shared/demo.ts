import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'

export interface DemoFile {
  type: 'vue' | 'normal' | 'css'
  export?: string
  path: string
  gitignore?: boolean
}

export interface MarkdownDemoEnv extends MarkdownEnv {
  demoFiles?: DemoFile[]
}

export interface DemoMeta {
  type: 'vue' | 'normal'
  url: string
  title?: string
  desc?: string
  codeSetting?: string
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
}
