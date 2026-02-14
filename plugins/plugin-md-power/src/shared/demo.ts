import type Token from 'markdown-it/lib/token.mjs'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'

/**
 * Demo File Type
 *
 * 演示文件类型
 */
export interface DemoFile {
  /**
   * File type
   *
   * 文件类型
   */
  type: 'vue' | 'normal' | 'css' | 'markdown'
  /**
   * Export name
   *
   * 导出名称
   */
  export?: string
  /**
   * File path
   *
   * 文件路径
   */
  path: string
  /**
   * Whether to add to gitignore
   *
   * 是否添加到 gitignore
   */
  gitignore?: boolean
}

/**
 * Markdown Demo Environment
 *
 * Markdown 演示环境
 */
export interface MarkdownDemoEnv extends MarkdownEnv {
  /**
   * Demo files
   *
   * 演示文件列表
   */
  demoFiles?: DemoFile[]
}

/**
 * Demo Metadata
 *
 * 演示元数据
 */
export interface DemoMeta {
  /**
   * Demo type
   *
   * 演示类型
   */
  type: 'vue' | 'normal' | 'markdown'
  /**
   * URL
   *
   * 链接地址
   */
  url: string
  /**
   * Title
   *
   * 标题
   */
  title?: string
  /**
   * Description
   *
   * 描述
   */
  desc?: string
  /**
   * Code settings
   *
   * 代码设置
   */
  codeSetting?: string
  /**
   * Whether expanded
   *
   * 是否展开
   */
  expanded?: boolean
}

/**
 * Demo Container Render
 *
 * 演示容器渲染器
 */
export interface DemoContainerRender {
  /**
   * Before render
   *
   * 渲染前
   */
  before: (
    app: App,
    md: Markdown,
    env: MarkdownDemoEnv,
    meta: DemoMeta,
    codeMap: Record<string, string>,
  ) => string
  /**
   * After render
   *
   * 渲染后
   */
  after: () => string
  /**
   * Token processor
   *
   * 令牌处理器
   */
  token?: (token: Token, tokens: Token[], index: number) => void
}
