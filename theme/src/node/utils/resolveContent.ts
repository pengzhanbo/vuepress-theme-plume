import type { App } from 'vuepress'

/**
 * Options for resolving content to be written to a temporary file.
 *
 * 解析要写入临时文件的内容的选项。
 */
export interface ResolveContentOptions {
  /** Variable name for the exported content / 导出内容的变量名 */
  name: string
  /** Content to be serialized / 要序列化的内容 */
  content: any
  /** Content to prepend before the export / 在导出之前添加的内容 */
  before?: string
  /** Content to append after the export / 在导出之后添加的内容 */
  after?: string
}

/**
 * Resolve content string for writing to temporary files.
 * Generates JavaScript module content with HMR support in development mode.
 *
 * 解析用于写入临时文件的内容字符串。
 * 在开发模式下生成带有 HMR 支持的 JavaScript 模块内容。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Content resolution options / 内容解析选项
 * @param options.name - Variable name for the exported content / 导出内容的变量名
 * @param options.content - Content to be serialized / 要序列化的内容
 * @param options.before - Content to prepend before the export / 在导出之前添加的内容
 * @param options.after - Content to append after the export / 在导出之后添加的内容
 * @returns Resolved content string / 解析后的内容字符串
 */
export function resolveContent(app: App, { name, content, before, after }: ResolveContentOptions): string {
  content = `${before ? `${before}\n` : ''}export const ${name} = ${JSON.stringify(content)}${after ? `\n${after}` : ''}`

  if (app.env.isDev) {
    const func = `update${name[0].toUpperCase()}${name.slice(1)}`
    content += `\n
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.${func}) {
    __VUE_HMR_RUNTIME__.${func}(${name})
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ ${name} }) => {
    __VUE_HMR_RUNTIME__.${func}(${name})
  })
}
`
  }
  return content
}
